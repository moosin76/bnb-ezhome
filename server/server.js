require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
require('./plugins/pm2Bus');

(async function(){
	// 앱 초기화
	const app = express();
	const port = process.env.VUE_APP_SERVER_PORT || 3000;
	const webServer = http.createServer(app);

	const socket = require('./plugins/socket');
	socket(webServer);

	// cors
	// const cors = require('cors');
	// app.use(cors())

	// 설치 정보 // DB정보 가있는가

	// 설정정보 로드
	const configModel = require('./api/_model/configModel');	
	console.log("설정 로그 전")
	await configModel.load();
	console.log("설정 로드 후");

	// setInterval(()=>{
	// 	console.log('test site->', siteConfig.test1);
	// 	console.log('test clie->', clientConfig.test1);
	// }, 5000);


	let isDisableKeepAlive = false;
	app.use((req, res, next)=>{
		if(isDisableKeepAlive) {
			console.log('Keep Alive', isDisableKeepAlive);
			res.set('Connection', 'close');
		}
		next();
	})


	// 파비콘
	app.use((req, res, next)=>{
		if(req.path.indexOf('favicon.ico') > -1) {
			const favicon = fs.readFileSync(path.join(__dirname, '../dist/favicon.ico'));
			res.status(200).end(favicon);
			return;
		}
		next();
	});

	// 파서
	app.use(express.json());
	app.use(express.urlencoded({extended: true}));
	const fileUpload = require('express-fileupload');
	app.use(fileUpload());
	const cookieParser = require('cookie-parser');
	app.use(cookieParser());

	// 글로벌 
	global.MEMBER_PHOTO_PATH = path.join(__dirname, './upload/memberPhoto');
	fs.mkdirSync(MEMBER_PHOTO_PATH, {recursive: true});

	// Passport
	const passport = require('./plugins/passport');
	passport(app);

	// 멤버이미지 
	const thumbnail = require('./plugins/thumbnail');
	app.use('/upload/:_path', thumbnail(path.join(__dirname, './upload')));

	// 정적 폴더
	app.use(express.static(path.join(__dirname, "../dist")));

	// API 라우터
	const autoRoute = require('./autoRoute');
	autoRoute('/api', app);
	app.use('/api/*', (req, res)=> {
		res.json({err : '요청하신 API가 없습니다.'});
	})


	// Vue SSR
	const { createBundleRenderer } = require('vue-server-renderer');
	const template = fs.readFileSync(path.join(__dirname, "index.template.html"), 'utf-8');
	const serverBundle = require(path.join(__dirname, "../dist/vue-ssr-server-bundle.json"));
	const clientManifest = require(path.join(__dirname, "../dist/vue-ssr-client-manifest.json"));

	app.get('*', (req, res) => {
		const renderer = createBundleRenderer(serverBundle, {
			runInNewContext : false,
			template,
			clientManifest
		});
		// console.log(process.memoryUsage());
		// console.log("user", req.user);
		const ctx = {
			url : req.url,
			title : "Vue SSR App",
			metas : `<!-- inject more metas -->`,
			member : req.user || null,
			token : req.cookies.token || null,
			config : clientConfig,
		};
		const stream = renderer.renderToStream(ctx);
		stream.on('end', ()=>{
			const memSize = Object.entries(process.memoryUsage())[0][1];
			console.log("스트림 렌더 종료", (memSize/ 1024 / 1024).toFixed(4));
			if(process.platform == 'linux') {
				if(memSize > 150000000) {
					process.emit('SIGINT');
				}
			} 
		}).pipe(res);
	});

	// 서버 응답
	webServer.listen(port, () => {
		process.send('ready');
		console.log(`http://localhost:${port}`);
	});

	process.on('SIGINT', function() {
		isDisableKeepAlive = true;
		webServer.close(function(){
			console.log('server Closed');
			process.exit(0);
		})
	})
	
})();
