const fs = require('fs');
const router = require('express').Router();
const { isGrant, LV } = require('../../util/level');
const { modelCall, getIp } = require('../../util/lib');
const boardModel = require('./_model/boardModel');
const jwt = require('../plugins/jwt');

async function isModify(req, config, member, wrItem) {
	// console.log("token", wrItem.token, req.session.checkToken);
	// console.log(config);
	let msg = '수정권한이 없습니다.';
	if (member) {
		if (config.bo_table == 'popup' && member.mb_level >= LV.ADMIN) {
			msg = '';
		} else if (member.mb_level >= LV.SUPER || member.mb_id == wrItem.mb_id) {
			msg = '';
		}
	} else { // 비회원
		// 세션에다가 비밀번호
		if (typeof (wrItem.token) === 'string' &&
			wrItem.token === req.session.checkToken) {
			msg = '';
		}
	}

	delete wrItem.token;
	req.session.checkToken = '';
	return msg;
}

// 게시판 설정 불러오기
router.get('/config/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	const result = await modelCall(boardModel.getConfig, bo_table);
	res.json(result);
});

// 에디터 이미지 업로드
router.post('/imageUpload/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	const { bf_desc } = req.body;
	const result = await modelCall(boardModel.uploadFile, bo_table, bf_desc, req.files.upFile);
	res.json(result);
});

// 에디터 이미지 취소
router.put('/imgCancle/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	let cnt = 0;
	for (const file of req.body) {
		await modelCall(boardModel.removeFile, bo_table, file);
		cnt++;
	}
	res.json({ cnt });
});

// 신규 게시물 작성
router.post('/write/:bo_table', async (req, res) => {
	const data = req.body;
	const { bo_table } = req.params;
	data.wr_ip = getIp(req);

	// 권한 확인
	const config = await modelCall(boardModel.getConfig, bo_table);
	// return res.json({err : '작업중', data});

	if (data.wr_reply == 0) {
		const grant = isGrant(req, config.bo_write_level);
		if (!grant) {
			return res.json({ err: '게시물 작성 권한이 없습니다.' });
		}
	} else {
		const grant = isGrant(req, config.bo_comment_level);
		if (!grant) {
			return res.json({ err: '덧글 작성 권한이 없습니다.' });
		}
	}

	const result = await modelCall(boardModel.writeInsert, bo_table, data, req.files);
	if (data.wr_reply > 0) { // 코멘트 니깐 내용을 주자
		const options = {
			stf: ['wr_id'],
			stc: ['eq'],
			stx: [result.wr_id]
		};
		const item = await modelCall(boardModel.getList, bo_table, config, options, req.user);
		res.json(item.items[0]);
	} else {
		res.json(result);
	}

});

// 게시물 수정
router.put('/write/:bo_table/:wr_id', async (req, res) => {
	const data = req.body;
	const { bo_table, wr_id } = req.params;
	data.wr_ip = getIp(req);
	// 권한확인
	const config = await modelCall(boardModel.getConfig, bo_table);
	const modifyMsg = await isModify(req, config, req.user, data);

	if (modifyMsg) { // 에러메시지가 있으면 에러
		return res.json({ err: modifyMsg });
	}

	const result = await modelCall(boardModel.writeUpdate, bo_table, wr_id, data, req.files);

	if (data.wr_reply > 0) { // 코멘트 니깐 내용을 주자
		const options = {
			stf: ['wr_id'],
			stc: ['eq'],
			stx: [result.wr_id]
		};
		const item = await modelCall(boardModel.getList, bo_table, config, options, req.user);
		res.json(item.items[0]);
	} else {
		res.json(result);
	}
})

// 조회수 증가
router.put('/view/:bo_table/:wr_id', async (req, res) => {
	const { bo_table, wr_id } = req.params;
	const result = await modelCall(boardModel.viewUp, bo_table, wr_id);
	res.json(result);
})

// 게시판 목록 반환
router.get('/list/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	// console.log("GET list ==>> " +bo_table);
	// 권한 확인
	const config = await modelCall(boardModel.getConfig, bo_table);
	const grant = isGrant(req, config.bo_list_level);
	if (!grant) {
		return res.json({ err: '게시물 목록 보기 권한이 없습니다.' });
	}
	const options = req.query;
	// return res.json({err : '작업중', options,})
	const result = await modelCall(boardModel.getList, bo_table, config, options, req.user);
	res.json(result);
});

// 최근계시물 
router.get('/latest/:bo_table', async (req, res) => {
	const { bo_table } = req.params;
	const { limit } = req.query;
	const config = await modelCall(boardModel.getConfig, bo_table);
	const options = {
		page: 1,
		itemsPerPage: limit,
		stf: ['wr_reply', 'wr_parent'],
		stc: ['eq', 'eq'],
		stx: ['0', '0']
	}
	const result = await modelCall(boardModel.getList, bo_table, config, options, req.user);
	// {items, totalItems}
	result.subject = config.bo_subject;
	delete result.totalItems;
	res.json(result);
})


// 해당 게시물 아이디 내용 반환
router.get('/read/:bo_table/:wr_id', async (req, res) => {
	const { bo_table, wr_id } = req.params;
	// 권한 확인
	const config = await modelCall(boardModel.getConfig, bo_table);
	const grant = isGrant(req, config.bo_read_level);
	if (!grant) {
		return res.json({ err: '게시물 보기 권한이 없습니다.' });
	}

	const result = await modelCall(boardModel.getItem, bo_table, wr_id, req.user);
	res.json(result);
});

router.get('/download/:bo_table/:filename', async (req, res) => {
	const { bo_table, filename } = req.params;
	const config = await modelCall(boardModel.getConfig, bo_table);
	const grant = isGrant(req, config.bo_download_level);
	if (!grant) {
		return res.status(403).end('No file download permission.');
	}
	const { src } = req.query;

	const srcFile = `${UPLOAD_PATH}/${bo_table}/${src}`;

	if (!fs.existsSync(srcFile)) {
		return res.status(404).end('File not found.');
	}

	res.download(srcFile, filename);
});

// 삭제
router.delete('/:bo_table/:wr_id', async (req, res) => {
	const { bo_table, wr_id } = req.params;
	const { token } = req.query;
	// 게시판 설정
	const config = await modelCall(boardModel.getConfig, bo_table);
	// 게시물 가지고오고
	const data = await modelCall(boardModel.getItem, bo_table, wr_id, req.user);
	// 권한 확인하고
	data.token = token;
	const modifyMsg = await isModify(req, config, req.user, data);

	if (modifyMsg) { // 에러메시지가 있으면 에러
		return res.json({ err: modifyMsg });
	}
	// !!삭제
	const result = await modelCall(boardModel.deleteItem, bo_table, wr_id, req.user);
	res.json(result);
})

router.post('/check/:bo_table/:wr_id', async (req, res) => {
	const { bo_table, wr_id } = req.params;
	const { password } = req.body;

	// console.log("checkToke", req.session.checkToken);

	const cnt = await modelCall(boardModel.checkItem, bo_table, wr_id, password);
	if (cnt == 1) {
		const token = jwt.getRandToken(16);
		req.session.checkToken = token;
		res.json({ token });
	} else {
		res.json({ err: '비밀번호가 올바르지 않습니다.' });
	}
});

router.get('/popup-list', async (req, res) => {
	const { ignores } = req.query
	const result = await modelCall(boardModel.popupList, ignores);
	res.json(result);
})

module.exports = router;