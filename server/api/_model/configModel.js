const db = require('../../plugins/mysql');

const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');

const configModel = {
	async duplicateCheck({ field, value }) {
		const sql = sqlHelper.SelectSimple(
			TABLE.CONFIG,
			{ [field]: value },
			['COUNT(*) AS cnt']
		);
		const [[row]] = await db.execute(sql.query, sql.values);
		return row;
	},
	async get(req) {
		const { all } = req.query;
		let where = {};
		if(all == 'true') {
			if(!isGrant(req, LV.ADMIN)) {
				throw new Error('관리자 설정 목록 권한이 없습니다.')
			}
		} else {
			where.cf_client = 1;
		}
		const sort = {
			cf_group : true,
			cf_sort : true,
		}
		const sql = sqlHelper.SelectSimple(TABLE.CONFIG, where, [], sort);
		const [rows] = await db.execute(sql.query, sql.values);
		return rows;
	}, 
	async post(data) {
		// const data = req.body;

		// const maxSql = sqlHelper.SelectSimple(
		// 	TABLE.CONFIG,
		// 	{ cf_group: data.cf_group },
		// 	['IFNULL(MAX(cf_sort), -1) AS max']
		// );

		// const [[{ max }]] = await db.execute(maxSql.query, maxSql.values);
		// data.cf_sort = max + 1;

		const sql = sqlHelper.InsertOrUpdate(TABLE.CONFIG, data);
		const [row] = await db.execute(sql.query, sql.values);
		return row; // 업뎃된거 넘겨줄거고
	},
	async put(req) {
		req.body.forEach((item)=>{
			configModel.post(item);
		})
		return true;
	}
};

module.exports = configModel;
