const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const boardModel = require('./_model/boardModel');

router.get('/config/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	const result = await modelCall(boardModel.getConfig, bo_table);
	res.json(result);
});

router.post('/imageUpload/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	const { bf_desc } = req.body;
	const result = await modelCall(boardModel.uploadFile, bo_table, bf_desc, req.files.upFile);
	res.json(result);
});

router.put('/imgCancle/:bo_table', async(req, res)=> {
	const {bo_table} = req.params;
	let cnt = 0;
	for(const file of req.body) {
		await modelCall(boardModel.removeFile, bo_table, file);
		cnt++;
	}
	res.json({cnt});
})

module.exports = router;