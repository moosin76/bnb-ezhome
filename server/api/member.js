const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const memberModel = require('./_model/memberModel');

router.get('/duplicateCheck/:field/:value', async (req, res) => {
	const result = await modelCall(memberModel.duplicateCheck, req.params);
	res.json(result);
});

module.exports = router;