const request = require('request');
const cheerio = require('cheerio');


defPttListCallBack = (list) => {
  console.log(list);
}
exports.pttList = function (callback = defPttListCallBack, bulletin = 'stock', period = 3600) {
  request('https://www.ptt.cc/bbs/' + bulletin + '/index.html',
    (err, res, body) => {
      // console.log(res.statusCode);
      if (res.statusCode === 302) {
        //18禁版需處理ＴＯＤＯ
      } else if (res.statusCode === 200) {
        const $ = cheerio.load(body);
        // 抓取文章列表 
        const article = $('.r-ent');
        const list = $('.r-ent').map((index, obj) => {
          const aa = $(obj).find('.title a');
          const href = aa.attr('href');
          return {
            title: aa.text(),
            link: 'https://www.ptt.cc/' + href,
            timestamp: href && href.length > 13 ? href.substr(8 + bulletin.length, 10) : '',
            author: $(obj).find('.author').text(),
            date: $(obj).find('.date').text(),
            push: $(obj).find('.nrec span').text(),
            index: index,
          }
        }).get();
        // console.log(list);
        // filter 多少時間之前的文章
        const filterList = list.filter((post) => {
          return post.timestamp > (Date.now() / 1000 - period)
        })
        callback(filterList);
      } else {
        throw new Error('Error response code');
      }
    })
}