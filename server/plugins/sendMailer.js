const nodemailer = require('nodemailer');

const { NODEMAILER_USER, NODEMAILER_PASS } = siteConfig;

const transPorter = nodemailer.createTransport({
	service : 'gmail',
	host : 'smtp.gmail.com',
	port : 587,
	secure : false,
	auth : {
		user : NODEMAILER_USER,
		pass : NODEMAILER_PASS
	},
});

function sendMailer() {
	let instance = null;
	return {
		getInstance : function() {
			if(instance == null) {
				instance = async (from, to, subject, html) => {
					const info = await transPorter.sendMail({
						from : `${from} <${NODEMAILER_USER}>`,
						to,
						subject,
						html,
					});
					// console.log("sendMailer Info", info);
					return info;
				}
			}
			return instance;
		}
	}
}
module.exports = sendMailer().getInstance();