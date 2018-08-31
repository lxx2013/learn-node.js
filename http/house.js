var url = {};
url.login_url = 'http://119.97.201.28:6081/chktest2.aspx?gid=E5FD011F-2B50-4E9D-A9E4-23BF6FBFADF2'
url.target_url = 'http://119.97.201.28:6081/ShowPrice.aspx?gid=E5FD011F-2B50-4E9D-A9E4-23BF6FBFADF2&ch='
const cheerio = require('cheerio')
const superagent = require('superagent')
// 浏览器请求报文头部部分信息
var browserMsg = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36",
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'Connection': 'keep-alive',
  'Host': '119.97.201.28:6081',
  'Upgrade-Insecure-Requests': '1',
};

//访问登录接口获取cookie
function getLoginCookie() {
  return new Promise(function (resolve, reject) {
    superagent.get(url.login_url).set(browserMsg).send({
      'gid': 'E5FD011F-2B50-4E9D-A9E4-23BF6FBFADF2'
    }).redirects(0).end(function (err, response) {
      //获取cookie
      var cookie = response.headers["set-cookie"];
      var location = response.headers['location'];
      console.log(`response location:${location}\n`);
      resolve({
        cookie,
        location
      });
    });
  });
}

function getData(data) {
  var str = data.location;
  var cookie = data.cookie.toString().match(/([^;]*);(.*)/)[1];
  var ch = str.match(/.*ch=(.*)/)[1];

  return new Promise(function (resolve, reject) {
    //传入cookie
    var sss = superagent.get(url.target_url + ch).set("Cookie", cookie).set(browserMsg).send({
      'gid': 'E5FD011F-2B50-4E9D-A9E4-23BF6FBFADF2',
      'ch': ch
    })
    //console.log(sss)
    sss.end(function (err, res) {
      if (err) console.log(err);

      resolve(res.text);
    });
  });
};

function parse(str) {
  console.log(typeof str)
  var $ = cheerio.load(str,{ decodeEntities: false });
  var e = {};
  var $$ = $(`.table-condensed`)
  for(var i =1;i<=5;i++){
    var $$$ = $$.find(`tr:nth-of-type(${i})`)
    e[$$$.find('td:nth-of-type(1)').text()] = i!=5? $$$.find('td:nth-of-type(2)').text() :"http://119.97.201.28:6081/"+ $$$.find('td:nth-of-type(2)').html().match(/.*src="(.*)">/)[1]
  }
  return e;
}



//var str =  `\r\n\r\n<!DOCTYPE html>\r\n\r\n<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>\r\n\r\n</title>\r\n    <!-- 最新版本的 Bootstrap 核心 CSS 文件 -->\r\n    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" />\r\n\r\n    <!-- 可选的 Bootstrap 主题文件（一般不用引入） -->\r\n    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" />\r\n    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>\r\n    <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->\r\n    <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>\r\n</head>\r\n<body>\r\n    <form method="post" action="ShowPrice.aspx?gid=E5FD011F-2B50-4E9D-A9E4-23BF6FBFADF2&amp;ch=wUmo7fvnHpf7zf%2bInirgJw%3d%3d" id="form1">\r\n<div class="aspNetHidden">\r\n<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/wEPDwUKMTM4OTE5MDI3MWRk7RjNcHTtNuxHEh95d74DETAoKtcxzlaFaIfmeIVTQeA=" />\r\n</div>\r\n\r\n        <div class="container">\r\n            <h1>商品房备案价格查询</h1>\r\n            <table class=\'table table-condensed table-hover\'>\r\n                              <caption>楼盘表（房屋单价表）</caption>\r\n                              <thead>\r\n<tr>\r\n                                  <th>#</th>\r\n                                  <th>楼盘指标</th>\r\n                                  <th>详细信息</th>          \r\n                                </tr>\r\n                              </thead>\r\n                              <tbody>\r\n                          <tr>\r\n                                  <th >1</th>\r\n                                  <td>房屋座落</td>\r\n                   <td>经开中心城5#地块5-2栋2单元11层（1）号</td>         \r\n                                </tr>\r\n                                <tr>\r\n                                  <th>2</th>\r\n                                  <td>预售许可证号</td>\r\n                                  <td>武房开预售[2018]344号</td>          \r\n                                </tr>\r\n                                <tr>\r\n<th >3</th>\r\n                                  <td>预测面积（平方米）</td>\r\n                                  <td>134.61</td>        \r\n                    </tr>\r\n                                <tr>\r\n                                  <th >4</th>\r\n                                  <td>实测面积（平方米）</td>\r\n                                  <td>0.00</td>        \r\n                                </tr>\r\n         <tr>\r\n                                  <th >5</th>\r\n                                  <td>预售方案备案单价（元）</td>\r\n                <td><img src=GetHouseInfo.ashx?price=Gt3SA8AoG16SXqlyAzqzmQ==></td>        \r\n                                </tr>\r\n             </tbody>\r\n                            </table>\r\n            <p>备注：</p>\r\n            <p>1.因网络通讯故障、房地产开发企业上报信息不及时、上报信息填写错误等原因，可能会造成已备案的合同信息查询不到。请同具体的房地产开发企业及办理业务的区房产管理局联系。</p>\r\n            <p>2.2016年1月1日后取得预售许可的商品房项目中，准售房屋的单价可在预售许可证发放后的2个工作日后在楼盘表（房屋单价表）中查询。</p>\r\n            <p>3.本网站数据维护时间为每天凌晨1:00--5:00。数据维护期间，可能出现页面无法响应的问题，请避开此时段进行查询。</p>\r\n        </div>\r\n    </form>\r\n\r\n</body>\r\n</html>\r\n`
;(async () => {
  let cookie = await getLoginCookie();
  let t = await getData(cookie);
  console.log(parse(t))
})();