const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');

const tagModel = {
	async registerTags(bo_table, wr_id, wrTags) {
		// 이미 게시판 아이디에 해당하는 태그를 모두 제거
		await tagModel.deleteTags(bo_table, wr_id);
		// 태그 목록을 모두 삽입
		const tagData = [];
		for (const bt_tag of wrTags) {
			tagData.push({ bo_table, wr_id, bt_tag });
		}

		if (tagData.length) {
			const sql = sqlHelper.InsertArray(TABLE.BOARD_TAGS, tagData);
			await db.execute(sql.query, sql.values);
		}
	},
	async deleteTags(bo_table, wr_id) {
		const sql = sqlHelper.DeleteSimple(TABLE.BOARD_TAGS, {
			bo_table,
			wr_id
		});
		await db.execute(sql.query, sql.values);
	},
	async getTags(bo_table, wr_id) {
		const sql = sqlHelper.SelectSimple(TABLE.BOARD_TAGS, {bo_table, wr_id}, ['bt_tag']);
		const [rows] = await db.execute(sql.query, sql.values);
		const wrTags = [];
		for(const row of rows) {
			wrTags.push(row.bt_tag);
		}
		return wrTags;
	}
};

module.exports = tagModel;