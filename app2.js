var express = require('express');
var app = express();

var Promise = require('promise');
var request = require('request');
var nodemailer = require('nodemailer');
var axios = require('axios');
const requestImageSize = require('request-image-size');

let isSent = false;
let image = { width: 277, height: 1700, type: 'png', downloaded: 752 };
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
        email('상장?', '<image src="https://www.bithumb.com/resources/img/comm/sp_coin.png"/>');
      } else {
        image = size;
      }
    })
    .catch(err => {
      email('error', err + '"https://www.bithumb.com/resources/img/comm/sp_coin.png"');
    });
}, 1000 * 60 * 5);



let init = () => {
  setInterval(async () => {
    let res = await axios.get('http://bithumb.cafe/wp-json/wp/v2/posts?orderby=date&categories=43&order=desc');
    if (res.data[0].id != 26964 && !isSent) {
      email('빗섬 : ' + res.data[0].title.rendered, res.data[0].link);
      console.log(res.data[0].title.rendered);
      isSent = true;
    };
  }, 1000 * 3);
}

init();