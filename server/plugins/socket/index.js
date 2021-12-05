require('dotenv').config();
const { Server } = require("socket.io");
const redisAdapter = require('socket.io-redis');
const configHandler = require('./configHandler');

const { REDIS_HOST, REDIS_PORT } = process.env;

module.exports = function (webServer) {
	const io = new Server(webServer);
	io.adapter(redisAdapter({ host: REDIS_HOST, port: REDIS_PORT }));

	io.on("connection", (socket) => {
		configHandler(io, socket);

		console.log('a user connected ' + socket.id);

		socket.on("disconnect", () => {
			console.log('disconnect');
		});

		socket.on('room:join', (roomName) => {
			console.log("room:join", roomName);
			socket.join(roomName);
		});

		socket.on('room:leave', (roomName) => {
			console.log("room:leave", roomName);
			socket.leave(roomName);
		});

		socket.on('room:send', (data) => {
			console.log(data);
			const msg = data.msg + " 서버 응답";
			// io.emit('room:msg', {msg}); // 모든 사용자
			// socket.broadcast.emit('room:msg', {msg}); // 나를 제외한 모든 사용자
			io.to('roomtest').emit('room:msg', { msg }); // 룸에 있는 모든 사용자
			// socket.to('roomtest').emit('room:msg', {msg});	// 룸에있는 나를 제외한 모든 사용자
		})
	})

}