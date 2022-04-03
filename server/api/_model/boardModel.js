const path = require('path');
const fs = require('fs');
const db = require('../../plugins/mysql');
const jwt = require('../../plugins/jwt');

const tagModel = require('./tagModel');

const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const moment = require('../../../util/moment');
const { getSummary } = require('../../../util/lib');

const boardModel = {
	async getConfig(bo_table) {
		const sql = sqlHelper.SelectSimple(TABLE.BOARD, { bo_table });
		const [[row]] = await db.execute(sql.query, sql.values);
		if (!row) {
			throw new Error(`${bo_table} 게시판이 없습니다.`);
		}

		try {
			row.bo_category = JSON.parse(row.bo_category);
			row.wr_fields = JSON.parse(row.wr_fields);
			row.bo_sort = JSON.parse(row.bo_sort);
		} catch (e) { }

		return row;
	},
	async uploadFile(bo_table, bf_desc, file, wr_id = 0) {
		const ext = path.parse(file.name).ext;
		const time = new Date().getTime();
		const dest = `${UPLOAD_PATH}/${bo_table}/${file.md5}${time}${ext}`;
		file.mv(dest);
		const bf_src = path.parse(dest).base;
		const payload = {
			bo_table,
			wr_id,
			bf_name: file.name,
			bf_src,
			bf_desc,
			bf_type: file.mimetype,
			bf_size: file.size,
			bf_createat: moment().format('LT'),
		};
		const sql = sqlHelper.Insert(TABLE.BOARD_FILE, payload);
		const [rows] = await db.execute(sql.query, sql.values);
		const result = {
			bf_id: rows.insertId,
			bf_src
		}
		return result;
	},
	async removeFile(bo_table, file) {
		const { bf_id, bf_src } = file;
		const filePath = `${UPLOAD_PATH}/${bo_table}/${bf_src}`;
		const cachePath = `${UPLOAD_PATH}/${bo_table}/.cache`;
		const baseName = path.parse(bf_src).name;

		// 파일 삭제
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
		//썸네일 삭제
		if (fs.existsSync(cachePath)) {
			const cacheDir = fs.readdirSync(cachePath);
			for (const p of cacheDir) {
				if (p.startsWith(baseName)) {
					try {
						// console.log(`delete ${p}`);
						fs.unlinkSync(`${cachePath}/${p}`);
					} catch (e) {
						console.log(`delete ${p} error`, e.message);
					}
				}
			}
		}

		// DB에서 삭제
		const sql = sqlHelper.DeleteSimple(TABLE.BOARD_FILE, { bf_id });
		await db.execute(sql.query, sql.values);
	},
	async writeInsert(bo_table, data, files) {
		// 에디터에서 업로드 한 이미지 목록
		const upImages = JSON.parse(data.upImages);
		delete data.upImages;
		// 태그 목록
		const wrTags = JSON.parse(data.wrTags);
		delete data.wrTags;
		// 게시판 테이블 명
		const table = `${TABLE.WRITE}${bo_table}`;

		// 게시판 글에 대한 그룹,정렬,깊이
		if (data.wr_parent == 0) { // 새글
			const grpQuery = `SELECT MAX(wr_grp) AS wr_grp FROM ${table}`;
			const [[{ wr_grp }]] = await db.execute(grpQuery);
			data.wr_grp = wr_grp ? wr_grp + 1 : 1;
			data.wr_order = 0;
			data.wr_dep = 0;
		} else { // 답글
			const grpQuery = `SELECT wr_grp, wr_order, wr_dep FROM ${table} WHERE wr_id=${data.wr_parent}`;
			const [[parent]] = await db.execute(grpQuery);
			data.wr_grp = parent.wr_grp;
			data.wr_order = parent.wr_order +1;
			data.wr_dep = parent.wr_dep + 1;
			const uSql = `UPDATE ${table} SET wr_order=wr_order+1
WHERE wr_reply=${data.wr_reply} AND wr_grp=${parent.wr_grp} AND wr_order >= ${data.wr_order}`;
			await db.execute(uSql);
		}

		// 게시판 작성일
		data.wr_createat = moment().format('LT');
		data.wr_updateat = moment().format('LT');

		// 요약정보 
		data.wr_summary = getSummary(data.wr_content, 250);

		if (data.wr_password) { // 비회원 암호
			data.wr_password = jwt.generatePassword(data.wr_password);
		}

		const sql = sqlHelper.Insert(table, data);
		const [rows] = await db.execute(sql.query, sql.values);
		const wr_id = rows.insertId; // 게시물 아이디

		// 태그 등록 
		await tagModel.registerTags(bo_table, wr_id, wrTags);

		// 첨부 파일 등록
		if (files) {
			const keys = Object.keys(files);
			for (const key of keys) {
				const file = files[key];
				await boardModel.uploadFile(bo_table, "", file, wr_id);
			}
		}

		// 게시물 내용에서 에디터 이미지가 있는지 여부를 확인해서 없는것들을 제거
		await boardModel.clearImages(bo_table, wr_id, data.wr_content, upImages);
		return { wr_id };
	},
	async writeUpdate(bo_table, wr_id, data, files) {
		const table = `${TABLE.WRITE}${bo_table}`;
		delete data.wr_id;

		// 기존 첨부파일
		const wrFiles = JSON.parse(data.wrFiles);
		delete data.wrFiles;

		// 기존 첨부파일에서 삭제가 참인거
		for (const wrFile of wrFiles) {
			if (wrFile.remove) {
				await boardModel.removeFile(bo_table, wrFile); // 파일삭제
			}
		}

		// 새로운 첨부파일 등록
		if (files) {
			const keys = Object.keys(files);
			for (const key of keys) {
				const file = files[key];
				await boardModel.uploadFile(bo_table, "", file, wr_id);
			}
		}

		// 에디터에서 이미지 처리
		const upImages = JSON.parse(data.upImages).concat(JSON.parse(data.wrImgs));
		delete data.upImages;
		delete data.wrImgs;
		await boardModel.clearImages(bo_table, wr_id, data.wr_content, upImages);

		// 데이터 정리
		delete data.wr_createat; // 생성일 삭제
		delete data.wr_password; // 비밀번호 삭제
		data.wr_updateat = moment().format('LT');
		data.wr_summary = getSummary(data.wr_content, 250);
		delete data.good;
		delete data.bad;
		delete data.replys;
		delete data.goodFlag;

		// 태그
		const wrTags = JSON.parse(data.wrTags);
		delete data.wrTags;
		await tagModel.registerTags(bo_table, wr_id, wrTags);

		const sql = sqlHelper.Update(table, data, { wr_id });
		const [rows] = await db.execute(sql.query, sql.values);
		return { wr_id };
	},
	async clearImages(bo_table, wr_id, wr_content, upImages) {
		for (const img of upImages) {
			if (wr_content.indexOf(img.bf_src) > -1) { // 게시물에 이미지가 있으면
				const sql = sqlHelper.Update(TABLE.BOARD_FILE, { wr_id }, { bf_id: img.bf_id });
				await db.execute(sql.query, sql.values);
			} else { // 게시물에 이미지가 없으면
				await boardModel.removeFile(bo_table, img);
			}
		}
	},
	async getList(bo_table, config, options, member) {
		const table = `${TABLE.VIEW}${bo_table}`;
		const sql = sqlHelper.SelectLimit(table, options);
		console.log(sql);
		const [items] = await db.execute(sql.query, sql.values);
		const [[{ totalItems }]] = await db.execute(sql.countQuery, sql.values);

		return { items, totalItems };
	},
	async getItem(bo_table, wr_id, member) {
		const table = `${TABLE.VIEW}${bo_table}`;
		const sql = sqlHelper.SelectSimple(table, { wr_id });
		// console.log("SQL", sql);
		const [[item]] = await db.execute(sql.query, sql.values);
		if (!item) {
			throw new Error('게시물이 없습니다.');
		}

		// 첨부파일 목록 붙이고
		const files = await boardModel.getItemFiles(bo_table, wr_id, item.wr_content);
		item.wrImgs = files.wrImgs;
		item.wrFiles = files.wrFiles;
		// 게시물 태그들
		item.wrTags = await tagModel.getTags(bo_table, wr_id);
		// TODO : 좋아요 

		delete item.wr_password;
		return item;
	},
	async getItemFiles(bo_table, wr_id, wr_content = "") {
		const sql = sqlHelper.SelectSimple(
			TABLE.BOARD_FILE,
			{ bo_table, wr_id },
			['bf_id', 'bf_name', 'bf_src', 'bf_desc', 'bf_type', 'bf_size']
		);
		const [rows] = await db.execute(sql.query, sql.values);
		const wrImgs = []; // 본문에 첨부된 이미지
		const wrFiles = []; // 첨부파일
		for (const row of rows) {
			if (wr_content.indexOf(row.bf_src) > -1) { // 본문에 경로가 있으면
				wrImgs.push(row);
			} else { // 없으니까 첨부파일
				row.remove = false; // 수정할때 첨부파일 삭제 여부
				wrFiles.push(row);
			}
		}
		return { wrImgs, wrFiles };
	}
};

module.exports = boardModel;