const { Server } = require("socket.io");

module.exports = function(webServer) {
	const io = new Server(webServer);
	

}