const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');

const configModel = {
	async load() {
		const sql = sqlHelper.SelectSimple(TABLE.CONFIG, null, ['cf_key', 'cf_val', 'cf_client', 'cf_type']);
		const [rows] = await db.execute(sql.query);
		const config = {};
		const clientConfig = {};
		for(const row of rows) {
			let val;
			if(row.cf_type == "Json") {
				val = JSON.parse(row.cf_val);
			} else {
				val = row.cf_val;
			}
		
			if(row.cf_client == 1) {
				clientConfig[row.cf_key] = val;
			} else {
				config[row.cf_key] = val;
			}
		}

		global.siteConfig = config;
		global.clientConfig = clientConfig;
		console.log('설정 로드')
		// console.log(siteConfig);
		// console.log('client config');
		// console.log(clientConfig);
	},
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
		const sql = sqlHelper.InsertOrUpdate(TABLE.CONFIG, data);
		const [row] = await db.execute(sql.query, sql.values);
		configModel.load();// 설정 다시 로드
		// 
		return data; // 업뎃된거 넘겨줄거고
	},
	async put(req) {
		req.body.forEach((item)=>{
			configModel.post(item);
		})
		return true;
	},
	async remove(req) {
		if(!isGrant(req, LV.SUPER)) {
			throw new Error('최고관리자만 삭제가 가능합니다.');
		}
		const {cf_key} = req.params;
		const sql = sqlHelper.DeleteSimple(TABLE.CONFIG, {cf_key});
		const [row] = await db.execute(sql.query, sql.values);

		configModel.load();// 설정 다시 로드
		return row.affectedRows == 1;
	},

};

module.exports = configModel;
