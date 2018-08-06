const http = require('http')
const queryString = require('querystring')
const url = 'http://202.114.18.218/Main.aspx'
const cheerio = require('cheerio')


function query(Building_No, Room_Number) {
  var data = SetData(Building_No, Room_Number)
  var option = SetOption(data)
  HttpPost(option, data, url)
    .then((str) => parse(str))
    .then((e) => Connect_DB(e,Building_No, Room_Number))
    .catch((err) => console.log(err))
}

query('沁苑12舍', 201)

function SetData(Building_No, Room_Number) {
  var area = ''
  if (/沁苑.*/.test(Building_No)) {
    area = '东区'
  }
  console.log("载入宿舍信息:"+area+Building_No+Room_Number)
  return queryString.stringify({
    '__EVENTTARGET': '',
    '__EVENTARGUMENT': '',
    '__LASTFOCUS': '',
    '__VIEWSTATE': `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`,
    '__EVENTVALIDATION': `/wEWIgKVova9CgLorceeCQLc1sToBgL+zpWoBQK50MfoBgKj5aPiDQLtuMzrDQLrwqHzBQKX+9a3BALahLK2BQLahLa2BQLahIq2BQLahI62BQLahIK2BQLahIa2BQLahJq2BQLahN61BQL4w577DwKH0Zq2BQKH0d61BQKVrbK2BQKVrba2BQKVrYq2BQKY14SVBQKY1+jwDAKY1/zbCwKY18CmAwLr76OiDwKUlLDaCAL61dqrBgLSwpnTCALSwtXkAgLs0fbZDALs0Yq1BXbeunm6ZWp2zzLmEqC8LvIlcmV/`,
    'programId': area,
    'txtyq': Building_No,
    'Txtroom': Room_Number,
    'ImageButton1.x': parseInt(30 * Math.random() + 20), //20-50
    'ImageButton1.y': parseInt(15 * Math.random() + 5), //5-20
    //'TextBox2': '2018-8-5 7:04:32',
    //'TextBox3': 168.0,
  })
}

function SetOption(data) {
  return {
    hostname: '202.114.18.218',
    port: 80,
    path: '/Main.aspx',
    method: 'POST',
    headers: {
      Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8`,
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Length': data.length,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': '202.114.18.218',
      'Origin': 'http://202.114.18.218',
      'Referer': 'http://202.114.18.218/Main.aspx',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    }
  }
}

function HttpPost(option, data, url) {
  return new Promise(function (resolve, reject) {
    console.log('正在爬取' + url)
    var req = http.request(option, function (res) {
      var str = '';
      console.log('响应结果:\nStatus: ' + res.statusCode)
      console.log('headers: ' + JSON.stringify(res.headers))
      res.on('data', function (t) {
        str += t.toString();
      })
      res.on('end', function () {
        console.log('请求结束!')
        resolve(str)
      })
    })
    req.on('error', (e) => {
      reject(e);
    })
    req.write(data)
    req.end()
  })
}

function parse(str) {
  return new Promise(function (resolve, reject) {
    if(/.*不存在该户信息.*/.test(str)){
      reject('此次查询无数据:不存在该户信息');
    }
    $ = cheerio.load(str,{decodeEntities: false})
    var e = []
    var reg = /.*<td>([^<]*)<\/td><td>([^<]*)<\/td>/
    for (var i = 2; i <= 8; i++) {
      reg.exec($('#GridView2').find('tr:nth-of-type(' + i + ')').html())
      e.push({
        elec_value: RegExp.$1,
        elec_date: RegExp.$2
      })
    }
    //可能有新的缴费
    var reg2 = /.*<td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td>/
    if(reg2.exec($('#GridView1').find('tr:nth-of-type(' + 2 + ')').html())){
      var new_date = RegExp.$1, new_value = RegExp.$3.match(/.*购\(用\)量：(.*)单价.*/)[1].trim()
      if(new Date(new_date) > new Date( e[0].elec_date)){
        e.unshift({
          elec_value: (parseFloat(e[0].elec_value)+parseFloat(new_value)).toString(),
          elec_date: new_date
        })
      }
    }
    
    resolve(e)
  })
}

function Connect_DB(e,Building_No, Room_Number) {
  console.log('要存储的数据:\n')
  console.log(e)
}
