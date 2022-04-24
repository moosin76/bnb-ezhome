const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const moment = require('../../../util/moment');

const goodModel = {
	async getFlag(bo_table, wr_id, mb_id) {
		const sql = sqlHelper.SelectSimple(TABLE.BOARD_GOOD, {
			bo_table,
			wr_id,
			mb_id
		}, ['bg_flag']);
		const [[row]] = await db.execute(sql.query, sql.values);
		return row ? row.bg_flag : 0;
	},
	async update(data) {
		data.bg_createat = moment().format("LT");
		const sql = sqlHelper.InsertOrUpdate(TABLE.BOARD_GOOD, data);
		await db.execute(sql.query, sql.values);
		const good = await goodModel.get(data);
		return good;
	},
	async get({ bo_table, wr_id, mb_id }) {
		const good = await goodModel.getCount(bo_table, wr_id, 1);
		const bad = await goodModel.getCount(bo_table, wr_id, 2);
		const goodFlag = await goodModel.getFlag(bo_table, wr_id, mb_id);
		return { good, bad, goodFlag };
	},
	async getCount(bo_table, wr_id, bg_flag) {
		const sql = sqlHelper.SelectSimple(TABLE.BOARD_GOOD, {
			bo_table, wr_id, bg_flag
		}, ['COUNT(*) AS cnt']);
		const [[{ cnt }]] = await db.execute(sql.query, sql.values);
		return cnt;
	},
	async remove(data) {
		const sql = sqlHelper.DeleteSimple(TABLE.BOARD_GOOD, data);
		await db.execute(sql.query, sql.values);
		const good = await goodModel.get(data);
		return good;
	}
}

module.exports = goodModel;