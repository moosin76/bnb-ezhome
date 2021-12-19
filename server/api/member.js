const router = require('express').Router();
const passport = require('passport');
const { modelCall } = require('../../util/lib');
const memberModel = require('./_model/memberModel');
const jwt = require('../plugins/jwt');

router.get('/duplicateCheck/:field/:value', async (req, res) => {
	const result = await modelCall(memberModel.duplicateCheck, req.params);
	res.json(result);
});

// 회원 생성
router.post('/', async (req, res) => {
	const result = await modelCall(memberModel.createMember, req);
	res.json(result);
});

// 회원정보 수정
router.patch('/', async (req, res) => {
	const result = await modelCall(memberModel.updateMember, req);
	res.json(result);
});

// 로컬 로그인 
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
					res.cookie('token', token, { httpOnly: true });
					res.json({ member, token });
				}
			})
		}
	})(req, res);
});

// 인증
router.get('/auth', (req, res) => {
	const member = req.user || null;
	const token = req.cookies.token || null;
	res.json({ member, token });
})

// 로그아웃
router.get('/signOut', (req, res) => {
	res.clearCookie('token');
	res.json(true);
});

// 아이디 찾기
router.get('/findId', async (req, res) => {
	const result = await modelCall(memberModel.findId, req.query);
	res.json(result);
});

// 비밀번호 찾기
router.get('/findPw', async (req, res) => {
	const result = await modelCall(memberModel.findPw, req);
	res.json(result);
});

// 비밀번호 수정
router.patch('/modifyPassword', async (req, res) => {
	const result = await modelCall(memberModel.modifyPassword, req.body);
	res.json(result);
});

// 구글 로그인 요청
router.get('/loginGoogle', passport.authenticate("google", { scope: ["email", "profile"] }));
// 카카오 로그인 요청
router.get('/loginKakao', passport.authenticate("kakao"));
// 네이버 로그인 요청
router.get('/loginNaver', passport.authenticate("naver"));

// 소셜 로그인 콜백
router.get('/social-callback/:provider', (req, res) => {
	const provider = req.params.provider;
	passport.authenticate(provider, async function (err, member) {
		// console.log("member",member);
		// console.log("err", err);
		const result = await modelCall(memberModel.socialCallback, req, res, err, member);
		res.end(result);
	})(req, res);
});

router.post('/checkPassword', async (req, res) => {
	const result = await modelCall(memberModel.checkPassword, req);
	res.json(result);
});

router.get('/', async (req, res) => {
	const result = await modelCall(memberModel.getMembers, req);
	res.json(result);
})

module.exports = router;