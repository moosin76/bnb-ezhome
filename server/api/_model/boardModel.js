const path = require('path');
const fs = require('fs');
const db = require('../../plugins/mysql');

const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const moment = require('../../../util/moment');

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
	}
};

module.exports = boardModel;