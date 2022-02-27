const path = require('path');
const fs = require('fs');

const db = require('../../plugins/mysql');

const { LV, isGrant } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');

const admBoardModel = {
	async skinList() {
		const skinPath = path.join(__dirname, "../../../src/views/board/skins");
		const files = fs.readdirSync(skinPath, { withFileTypes: true });
		const skins = [];
		files.forEach(p => {
			if (p.isDirectory()) {
				skins.push(p.name);
			}
		});
		return skins;
	},
	async getByTable(req) {
		if (!isGrant(req, LV.ADMIN)) {
			throw new Error('게시판 설정 권한이 없습니다.');
		}
		const {bo_table} = req.params;
		const sql = sqlHelper.SelectSimple(TABLE.BOARD, {bo_table});
		const [[row]] = await db.execute(sql.query, sql.values);
		if(!row) {
			throw new Error(`${bo_table} 게시판이 존재 하지 않습니다.`);
		}
		return row;
	},
	async getList(req) {
		if (!isGrant(req, LV.ADMIN)) {
			throw new Error('게시판 목록 권한이 없습니다.');
		}
		const options = req.query;
		const cols = ['bo_table', 'bo_subject', 'bo_skin', 'bo_list_level',
			'bo_read_level', 'bo_write_level', 'bo_comment_level'];
		const sql = sqlHelper.SelectLimit(TABLE.BOARD, options, cols);
		const [items] = await db.execute(sql.query, sql.values);
		const [[{ totalItems }]] = await db.execute(sql.countQuery, sql.values);
		return { items, totalItems };
	},
	async createBoard(req) {
		if (!isGrant(req, LV.ADMIN)) {
			throw new Error('게시판 생성 권한이 없습니다.');
		}

		const data = req.body;
		data.bo_category = JSON.stringify(data.bo_category);
		data.bo_sort = JSON.stringify(data.bo_sort);
		data.wr_fields = JSON.stringify(data.wr_fields);

		let sqls = fs.readFileSync(__dirname + '/write_table.sql').toString();
		sqls = sqls.replace(/{{table}}/g, data.bo_table);
		const sqlArr = sqls.split(';');
		for (const sql of sqlArr) {
			if (sql.trim()) {
				await db.execute(sql);
			}
		}

		const sql = sqlHelper.Insert(TABLE.BOARD, data);
		const [rows] = await db.execute(sql.query, sql.values);

		// 업로드 폴더
		fs.mkdirSync(`${UPLOAD_PATH}/${data.bo_table}`, { recursive: true });
		fs.chmodSync(`${UPLOAD_PATH}/${data.bo_table}`, 0o707);
		// console.log(rows);
		return rows.affectedRows == 1;
	},
	async updateBoard(req) {
		if (!isGrant(req, LV.ADMIN)) {
			throw new Error('게시판 수정 권한이 없습니다.');
		}
		const {bo_table} = req.params;
		const data = req.body;
		delete data.bo_table;
		data.bo_category = JSON.stringify(data.bo_category);
		data.bo_sort = JSON.stringify(data.bo_sort);
		data.wr_fields = JSON.stringify(data.wr_fields);

		const sql = sqlHelper.Update(TABLE.BOARD, data, {bo_table});
		const [rows] = await db.execute(sql.query, sql.values);
		return rows.affectedRows == 1;
	}
};

module.exports = admBoardModel;