const pttInfo = require('./pttInfo');
const email = require('./email');
const schedule = require('node-schedule');

const DATE_TIME_FORMAT = 'yyyy-MM-dd hh:mm:ss';

const bulletin = process.env.BULLETIN || 'stock';
const beforeNow = process.env.BEFORE_NOW || 60 * 60; //(s)now - article time
const toEmail = process.env.TO_EMAIL || 'XXXXX@gmail.com';
const author = process.env.AUTHOR;
const authorArray = process.env.AUTHOR ? process.env.AUTHOR.split(',') : []; ////需訂閱的作者
const scanTime = process.env.SCAN_TIME || 30; //(s)schedule 
let articleUrlArray = []; //檢查重複
let pttList = [];

const date2str = (x, y) => {
  var z = {
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds()
  };
  y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
  });
  return y.replace(/(y+)/g, function (v) {
    return x.getFullYear().toString().slice(-v.length)
  });
}

const getPttList = () => {
  pttInfo.pttList((list) => {
    // console.log(list);
    pttList = list;
    let body = '';
    list.forEach(article => {
      const date = new Date(parseInt(article.timestamp + '000'));
      //不重複 在作者名單的才寄信
      if (!articleUrlArray.includes(article.link) && authorArray.includes(article.author)) {
        body += "[" + date2str(date, DATE_TIME_FORMAT) + "]" + article.author + ' : ' +
          '<a href="' + article.link + '">' + article.title + '</a> ' +
          '<br/>';
        articleUrlArray.push(article.link);
      };
    });
    // console.log(body);
    if (body.length > 0) {
      const today = new Date();
      email.send(toEmail, bulletin + date2str(today, DATE_TIME_FORMAT), body);
    }
  }, bulletin, beforeNow);
}

schedule.scheduleJob('*/' + scanTime + ' * * * * *', getPttList);
schedule.scheduleJob('0 0 0 * * *', () => {
  articleUrlArray.length = 0;
});