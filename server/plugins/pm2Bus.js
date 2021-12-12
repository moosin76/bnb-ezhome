const pm2 = require('pm2')

pm2.launchBus(function(err, pm2_bus) {
  // pm2_bus.on('process:msg', function(packet) {
  //   console.log(packet)
  // })

	pm2_bus.on('config:update', function({data}){
		if(data.cf_client) {
			clientConfig[data.cf_key] = data.cf_val;
		} else {
			siteConfig[data.cf_key] = data.cf_val;
		}
	});

	pm2_bus.on('config:remove', function({data}){
		delete clientConfig[data];
		delete siteConfig[data];
	});

	pm2_bus.on('config:restart', function(packet){
		console.log('Server Restart !!!');
		const exec = require('child_process').exec;
		exec('pm2 reload all', (err)=>{
			console.log("Server restart msg ", err);
		})
	})
});