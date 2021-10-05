const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const imageSize = require('image-size');

const thumbnail = function (uploadPath) {
	return async function (req, res, next) {
		// console.log('upload path ', _path + req.path);
		// console.log('--------------');
		const _path = `${uploadPath}/${req.params._path}`;
		
		const srcFile = `${_path}${req.path}`;
		const fileInfo = path.parse(req.path);

		if (!fs.existsSync(srcFile)) {
			// console.log('없음', srcFile);
			return res.status(400).json({ err: 'file not found' });
		}

		const dim = imageSize(srcFile);
		// console.log(dim)
		// gif 일때
		if (dim.type != "jpg" && dim.type != "png") {
			return res.end(fs.readFileSync(srcFile))
		}

		// 요청 사이즈
		const w = parseInt(req.query.w) || 0;
		const h = parseInt(req.query.h) || 0;
		// console.log('w, h', w, h);

		// 요청 사이즈가 둘다없으면
		if (w == 0 && h == 0) {
			// 원본을 보내준다
			// console.log("둘다 0이다")
			return res.end(fs.readFileSync(srcFile))
		}

		// 캐쉬 폴더 생성,
		const destPath = _path + '/.cache';
		fs.mkdirSync(destPath, { recursive: true });

		// 캐쉬 파일명
		const destFile = `${destPath}/${fileInfo.name}_w${w}_h${h}${fileInfo.ext}`;
		// console.log('destFile', destFile);

		// cache 된게 있으면 캐쉬 파일을 보내준다.
		if (fs.existsSync(destFile)) {
			// console.log('캐쉬된거 보냄')
			return res.end(fs.readFileSync(destFile));
		}
		// console.log('캐쉬 파일 생성');
		// console.log('srcFile', srcFile);
		// console.log('destFile', destFile);
		await sharp(srcFile).resize(w || null, h || null).toFile(destFile);
		return res.end(fs.readFileSync(destFile));
	}
}

module.exports = thumbnail;