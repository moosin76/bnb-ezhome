require('dotenv').config();
const { Server } = require("socket.io");
const redisAdapter = require('socket.io-redis');
const configHandler = require('./configHandler');
const roomHandler = require('./roomHandler');
const memberHandler = require('./memberHandler');

const { REDIS_HOST, REDIS_PORT } = process.env;

module.exports = function (webServer) {
	const io = new Server(webServer);
	io.adapter(redisAdapter({ host: REDIS_HOST, port: REDIS_PORT }));

	io.on("connection", (socket) => {
		configHandler(io, socket);
		roomHandler(io, socket);
		memberHandler(io, socket);

		console.log('a user connected ' + socket.id);

		socket.on("disconnect", () => {
			console.log('disconnect');
		});

		socket.on('room:send', (data) => {
			const msg = data.msg;
			switch (data.target) {
				case 1://전체
					io.emit('room:msg', { msg });
					break;
				case 2: // 브로드캐스트
					socket.broadcast.emit('room:msg', { msg });
					break;
				case 3: // 룸 전체
					io.to('testroom').emit('room:msg', { msg });
					break;
				case 4: // 룸 브로드캐스트
					socket.to('testroom').emit('room:msg', { msg });
					break;
			}
		});

		socket.on('room:chat', (data)=>{
			const {toId, fromId, userMsg} = data;
			io.to(toId).emit('room:chat', { fromId, userMsg });
		});
	})

}