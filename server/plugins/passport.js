require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('../plugins/jwt');
const memberModel = require('../api/_model/memberModel');
const { Strategy: JWTStategy, ExtractJwt } = require('passport-jwt');
const { SECRET_KEY } = process.env;

module.exports = (app) => {
	app.use(passport.initialize());

	passport.use(new LocalStrategy(
		{
			usernameField: 'mb_id',
			passwordField: 'mb_password'
		},
		async (mb_id, mb_password, done) => {
			try {
				mb_password = jwt.generatePassword(mb_password);
				const member = await memberModel.getMemberBy({ mb_id, mb_password });
				return done(null, member);
			} catch (e) {
				console.log(e.message);
				return done(null, null, '아이디 또는 비밀번호가 올바르지 않습니다.');
			}
		}
	));

	passport.use(new JWTStategy(
		{
			// jwtFromRequest: ExtractJwt.fromHeader('authorization'),
			jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: SECRET_KEY,
		},
		async (payload, done) => {
			try {
				const {mb_id} = payload;
				const member = await memberModel.getMemberBy({ mb_id });
				if(!member)  {
					throw new Error('회원 토큰이 유효하지 않습니다.');
				}
				return done(null, member);
			} catch(e) {
				return done(e);
			}
		}
	));

	app.use((req, res, next)=> {
		passport.authenticate('jwt', (err, user)=> {
			if(user) {
				// 로그인
				console.log("user1", user);
				req.login(user, {session : false}, (err) => {});
			} else {
				// 로그아웃
				try{
					req.logout();
				} catch(e){}
			}
			next();
		})(req, res, next);
	});
}