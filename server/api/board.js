const router = require('express').Router();
const {modelCall} = require('../../util/lib');
const boardModel = require('./_model/boardModel');

router.get('/config/:bo_table', async (req, res)=>{
	const {bo_table} = req.params;
	const result = await modelCall(boardModel.getConfig, bo_table);
	res.json(result);
});

module.exports = router;