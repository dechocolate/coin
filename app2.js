var express = require('express');
var app = express();

var Promise = require('promise');
var request = require('request');
var nodemailer = require('nodemailer');
var axios = require('axios');
const requestImageSize = require('request-image-size');

let recentId_b = 27071;
let recentId_c = 27071;
let recentId_u = 27071;
let image = { width: 277, height: 1876, type: 'png', downloaded: 752 };
const options = {
  url: 'https://www.bithumb.com/resources/img/comm/sp_coin.png',
  headers: {
    'User-Agent': 'request-image-size'
  }
};


function email(title, text) {
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
        pass: 'Rlawnsdud!123'
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      // from: 'ddonggllee2@naver.com', // sender address
      // to: 'ddonggllee2@naver.com', // list of receivers
      from: 'kimjy4536@gmail.com',
      to: 'kimjy4536@gmail.com',
      subject: title, // Subject line
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



setInterval(function () {
  requestImageSize(options)
    .then(size => {
      console.log(size);
      if (image.width !== size.width || image.height !== size.height) {
        email('상장?', size.height + '<image src="https://www.bithumb.com/resources/img/comm/sp_coin.png"/>');
        image = size;
      }
    })
    .catch(err => {
      email('error', err + '"https://www.bithumb.com/resources/img/comm/sp_coin.png"');
    });
}, 1000 * 60 * 5);



let init = () => {
  //빗썸
  setInterval(async () => {
    let res = await axios.get('http://bithumb.cafe/wp-json/wp/v2/posts?orderby=date&order=desc&categories=43');
    console.log('빗썸', recentId_b);
    if (recentId_b != res.data[0].id) {
      recentId_b = res.data[0].id;
      email('빗섬 : ' + res.data[0].title.rendered, res.data[0].link + ' // date : ' + res.data[0].date + ' // modified : ' + res.data[0].modified);
    };
  }, 1000 * 2);

  //코인원
  setInterval(async () => {
    let res = await axios.get('https://coinone.co.kr/api/talk/latest_notice/');
    console.log('코인원', recentId_c);
    if (recentId_c != res.data.id) {
      recentId_c = res.data.id;
      email('코인원 : ' + res.data.title, res.data.title);
    };
  }, 1000 * 2);

  //업비트
  setInterval(async () => {
    let res = await axios.get('https://api-manager.upbit.com/api/v1/notices?page=1&per_page=1');
    console.log('업비트', recentId_u);
    if (recentId_u != res.data.data.list[0].id) {
      recentId_u = res.data.data.list[0].id;
      email('업비트 : ' + res.data.data.list[0].title, ' // date : ' + res.data.data.list[0].created_at + ' // modified : ' + res.data.data.list[0].updated_at);
    };
  }, 1000 * 2);
}

init();