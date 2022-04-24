const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const goodModel = require('./_model/goodModel');

router.use('/:bo_table/:wr_id', (req, res, next) => {
	if (!req.user) {
		return { err: "회원만 가능합니다." };
	}
	next();
})

router.post('/:bo_table/:wr_id', async (req, res) => {
	const { bo_table, wr_id } = req.params;
	const { bg_flag } = req.body;
	const { mb_id } = req.user;
	const result = await modelCall(goodModel.update, { bo_table, wr_id, mb_id, bg_flag });
	res.json(result);
});

router.delete('/:bo_table/:wr_id', async (req, res) => {
	const { bo_table, wr_id } = req.params;
	const { mb_id } = req.user;
	const result = await modelCall(goodModel.remove, { bo_table, wr_id, mb_id });
	res.json(result);
})

module.exports = router;