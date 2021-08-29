const router = require('express').Router();
const passport = require('passport');
const { modelCall } = require('../../util/lib');
const memberModel = require('./_model/memberModel');
const jwt = require('../plugins/jwt');
const fs = require('fs');


router.get('/duplicateCheck/:field/:value', async (req, res) => {
	const result = await modelCall(memberModel.duplicateCheck, req.params);
	res.json(result);
});

router.post('/', async (req, res) => {
	const result = await modelCall(memberModel.createMember, req);
	res.json(result);
});

router.post('/loginLocal', async (req, res) => {
	passport.authenticate('local', function (err, member, info) {
		if (info) {
			res.json({ err: info });
		} else {
			req.login(member, { session: false }, (err) => {
				if (err) {
					console.log(err);
					res.json({ err });
				} else {
					const token = jwt.getToken(member);
					const data = memberModel.loginMember(req);
					member.mb_login_at = data.mb_login_at;
					member.mb_login_ip = data.mb_login_ip;
					res.json({ member, token });
				}
			})
		}
	})(req, res);
});

router.get('/auth', (req, res)=> {
	res.json(req.user || false);
})
module.exports = router;