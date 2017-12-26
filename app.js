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
// var type = ['BTC', 'ADA', 'XRP', 'ETH', 'ETC', 'QTUM', 'POWR', 
// 'XLM', 'BCC', 'MER', 'VOX', 'EMC2', 'SHIFT', 'NEO', 'OMG', 'STORJ', 'KMD', 'TIX', 'REP'];

// var type = ['BTC', 'ADA', 'XRP', 'ETH', 'ETC', 'QTUM', 'BCC', 'KMD', 'TIX', 'EMC2', 'LSK'];
var type = ['BTC', 'XMP', 'QTUM', 'ETH', "NEO", "XEM", "BCC"];

function Coin(name, url, pre, per, max, min, now, init) {
	this.name = name;
	this.url = url;
	this.pre = pre;
	this.per = per;
	this.max = max;
	this.min = min;
	this.now = now;
	this.init = init; //메일 처음 발송여부
}

type.forEach(function (coin) {
	coins[coin] = new Coin(coin, 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=USD,KRW', 0, 0, 0, 0, 0, false);
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
			console.log(res.name, res.now, res.per, res.min, res.max);
						
			if(res.init){ //메일 한번 발송되을때				
				// 2% 상하한가 변동시 알람
				if(res.per > res.max){ 
					coins[res.name].max = Number(res.max) + 2;
					coins[res.name].min = Number(res.min) + 2;
					email(res.name +" up!!! "+ res.per +" "+res.now);	
				}
				if(res.per < res.min){
					coins[res.name].max = Number(res.max) - 2;
					coins[res.name].min = Number(res.min) - 2;
					email(res.name +" down!!! "+ res.per +" "+res.now);	
				}
			}else{ //메일 발송 된적 없을때				
				// 10% 상하한가 변동시 처음 알람
				if(res.per < -2){					
					coins[res.name].init = true;
					coins[res.name].min = Number(res.per) - 2;				
					coins[res.name].max = Number(res.per) + 2;
					email(res.name +" down!! "+ res.per +" "+res.now);	
				}
				if(res.per > 2){
					coins[res.name].init = true;
					coins[res.name].min = Number(res.per) - 2;				
					coins[res.name].max = Number(res.per) + 2;
					email(res.name +" up!! "+ res.per +" "+res.now);					
				}
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