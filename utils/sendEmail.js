// require('dotenv').config()

//  const nodemailer = require("nodemailer");
 
// DB = process.env.HOST;

// module.exports = async (email, subject, text) => {
// 	try {
// 		const transporter = nodemailer.createTransport({
// 			host: process.env.HOST,
// 			service: process.env.SERVICE,
// 			port: Number(process.env.EMAIL_PORT),
// 			secure: Boolean(process.env.SECURE),
// 			auth: {
// 				user: process.env.USER,
// 				pass: process.env.PASS,
// 			},
// 		});

// 		await transporter.sendMail({
// 			from: process.env.USER,
// 			to: email,
// 			subject: subject,
// 			text: text,
// 		});
// 		console.log("email sent successfully");
// 	} catch (error) {
// 		console.log("email not sent!");
// 		console.log(error);
// 		return error;
// 	}
// };

const nodemailer = require("nodemailer");
require('dotenv').config()

module.exports = async (email, subject, verificationUrl) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			tls : { rejectUnauthorized: false },
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		const message = `Dear customer,\nPlease click the following link to verify your email address :\n${verificationUrl}.\n Have a good day :)`;

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: message,
		});

		console.log("Email sent successfully");
	} catch (error) {
		console.log("Email not sent!");
		console.log(error);
		return error;
	}
};

