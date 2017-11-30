var express = require('express');
var app = express();

var Promise = require('promise');
var request = require('request');
var nodemailer = require('nodemailer');

// app.get('/', function (req, res) {
// 	res.render('apidoc/index.html');
// });

// app.listen(3001);
// console.log('api doc start !!');
var coins = {};
var type = ['BTC', 'ADA', 'XRP', 'ETH', 'ETC', 'QTUM', 'POWR', 'XLM', 'BCC', 'MER'];

function Coin(name, url, pre, per, max, min, now) {
	this.name = name;
	this.url = url;
	this.pre = pre;
	this.per = per;
	this.max = max;
	this.min = min;
	this.now = now;
}


type.forEach(function (coin) {
	coins[coin] = new Coin(coin, 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=USD,KRW', 0, 0, 0, 0, 0);
});

// set init val
type.forEach(function (coin) {
	getPrice(coins[coin].name, coins[coin].url).then(function (res) {
		coins[coin].pre = res;
	});
});

function getPrice(name, url) {
	return new Promise(function (resolve, reject) {
		request(url, function (error, response, body) {
			if (error) reject(error);
			var res = JSON.parse(body);
			// console.log(name, res.KRW);
			resolve(res.KRW);
		});
	});
}

function updateVal(coin) {
	return new Promise(function (resolve, reject) {
		getPrice(coin.name, coin.url).then(function (res) {
			coin.now = res;
			coin.per = (((res - coin.pre) / coin.pre) * 100).toFixed(3);
			resolve(coin);
		});
	});
}



setInterval(function () {
	type.forEach(function (coin) {
		updateVal(coins[coin]).then(function (res) {
			console.log(res.name, res.now, res.per);
			if(res.per < -10){
				email(res.name + " down!! " + res.per);
			}
			if(res.per > 10){
				email(res.name + " up!! " + res.per);
			}
		});
	});
}, 5000);






function email(text) {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	nodemailer.createTestAccount((err, account) => {

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			// host: 'smtp.ethereal.email',
			// port: 587,
			// secure: false, // true for 465, false for other ports
			// service: 'naver',
			// auth: {
			// 	user: 'ddonggllee2@naver.com', // generated ethereal user
			// 	pass: 'wnsdud1'  // generated ethereal password
			// }

			service: 'Gmail',
			auth: {
				user: 'kimjy4536@gmail.com',
				pass: 'rlawnsdud1'
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			// from: 'ddonggllee2@naver.com', // sender address
			// to: 'ddonggllee2@naver.com', // list of receivers
			from: 'kimjy4536@gmail.com',
			to: 'kimjy4536@gmail.com',
			subject: text, // Subject line
			text: text, // plain text body
			// html: '<b>Hello world?</b>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	});
}