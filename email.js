const nodemailer = require('nodemailer');
const credentials = require('./credentials');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: credentials.gmail.user,
    pass: credentials.gmail.pass
  }
});
const from = credentials.gmail.user;
exports.send = function (to, subject, body) {
  var options = {
    //寄件者
    from: from,
    //收件者
    to: to,
    //主旨
    subject: subject,
    //html 的內文
    html: body,
  };
  //發送信件方法
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('訊息發送: ' + info.response);
    }
  });
}