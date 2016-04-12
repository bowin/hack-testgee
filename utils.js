'use strict';

var readline = require('readline');

function getLine(question) {
  return new Promise(function (resolve) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, function (answer) {
      resolve(answer);
      rl.close();
    });
  });
}

var P = {};
P.e = {};
P.f = function (a, b) {
  P.e[a] = {}, P.e[a].self = b
};
P.o = function (a, b, c) {
  return P.e[c][a] = b, b
};
P.l = function (a, b) {
  return P.e[b][a]
};

let ma = function () {
  var a = function (a, b) {
    P.o("arr", [a], b)
  };
  var b = function (a, b) {
    P.l("arr", b).push(a)
  };
  var c = function (a) {
    for (var b = [], c = 0, d = a.length - 1; d > c; c++) {
      var e = [];
      e[0] = Math.round(a[c + 1][0] - a[c][0]), e[1] = Math.round(a[c + 1][1] - a[c][1]), e[2] = Math.round(a[c + 1][2] - a[c][2]), 0 === e[0] && 0 === e[1] && 0 === e[2] || b.push(e)
    }
    return b
  };

  var d = function (a) {
    var b = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr", c = b.length, d = "", e = Math.abs(a), f = parseInt(e / c);
    f >= c && (f = c - 1), f && (d = b.charAt(f)), e %= c;
    var g = "";
    return 0 > a && (g += "!"), d && (g += "$"), g + d + b.charAt(e)
  };

  var e = function (a) {
    for (var b = [[1, 0], [2, 0], [1, -1], [1, 1], [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]], c = "stuvwxyz~", d = 0, e = b.length; e > d; d++)if (a[0] == b[d][0] && a[1] == b[d][1])return c[d];
    return 0
  };

  var f = function (a) {
    for (var b, f = c(P.l("arr", a)), g = [], h = [], i = [], j = 0, k = f.length; k > j; j++)b = e(f[j]), b ? h.push(b) : (g.push(d(f[j][0])), h.push(d(f[j][1]))), i.push(d(f[j][2]));
    return g.join("") + "!!" + h.join("") + "!!" + i.join("")
  };
  return {Z: f, W: b, p: a}
}();

var aa = {};
aa._ = function (a, b) {
  for (var c = b.slice(32), d = [], e = 0; e < c.length; e++) {
    var f = c.charCodeAt(e);
    d[e] = f > 57 ? f - 87 : f - 48
  }
  c = 36 * d[0] + d[1];
  var g = Math.round(a) + c;
  b = b.slice(0, 32);
  var h, i = [[], [], [], [], []], j = {}, k = 0;
  e = 0;
  for (var l = b.length; l > e; e++)h = b.charAt(e), j[h] || (j[h] = 1, i[k].push(h), k++, k = 5 == k ? 0 : k);
  for (var m, n = g, o = 4, p = "", q = [1, 2, 5, 10, 50]; n > 0;)n - q[o] >= 0 ? (m = parseInt(Math.random() * i[o].length, 10), p += i[o][m], n -= q[o]) : (i.splice(o, 1), q.splice(o, 1), o -= 1);
  return p
};

// console.log(aa._(54, 'fa9b72732cd0e89e88cb2ea65f4d7213it'));
let a = {id: 1460105955100};
P.e[a.id] = {};
ma.p([-22, -20, 0], a.id);
ma.W([0, 0, 0], a.id);

P.e[a.id].arr = [];
var path_121 = [
  [-26, -29, 0],
  [0, 0, 0],
  [0, 0, 73],
  [4, 0, 90],
  [12, 0, 106],
  [20, 0, 124],
  [27, 0, 141],
  [37, 0, 158],
  [42, 0, 176],
  [45, 0, 192],
  [46, 0, 210],
  [47, 0, 233],
  [48, 0, 272],
  [49, 0, 298],
  [50, 0, 316], [51, 0, 332], [54, 0, 349], [60, 0, 366], [66, 0, 384], [76, 0, 400], [81, 0, 417], [92, 0, 434], [100, 0, 451], [104, 0, 468], [106, 0, 485], [107, 0, 592], [108, 0, 618], [109, 0, 635], [112, 0, 652], [113, 0, 669], [114, 0, 689], [115, 0, 706], [116, 0, 857], [116, 0, 890], [117, 0, 1001], [118, 0, 1041], [119, 0, 1058], [120, 0, 1075], [121, 0, 1296],
  [121, 0, 1441]
];

var path_183 = [[-23, -24, 0], [0, 0, 0], [1, 0, 520], [2, 0, 559], [2, 0, 585], [3, 0, 609], [4, 0, 633], [4, 0, 657], [5, 0, 674], [6, 0, 691], [8, 0, 708], [10, -2, 726], [13, -2, 743], [16, -2, 760], [19, -2, 776], [25, -2, 794], [29, -2, 810], [33, -2, 828], [37, -2, 845], [41, -2, 862], [44, -2, 879], [47, -2, 896], [49, -2, 913], [51, -2, 931], [53, -2, 948], [55, -2, 965], [58, -2, 983], [61, -2, 1000], [64, -2, 1021], [67, -2, 1036], [71, -2, 1053], [76, -2, 1070], [79, -2, 1087], [83, -2, 1103], [87, -2, 1121], [92, -2, 1138], [95, -2, 1155], [101, -2, 1172], [105, -3, 1189], [108, -3, 1206], [111, -3, 1223], [114, -3, 1240], [117, -3, 1257], [120, -3, 1274], [122, -4, 1292], [125, -4, 1309], [127, -4, 1326], [129, -4, 1343], [131, -4, 1360], [133, -4, 1376], [134, -5, 1393], [135, -5, 1411], [136, -5, 1428], [137, -5, 1445], [138, -5, 1462], [139, -5, 1479], [141, -5, 1496], [142, -5, 1514], [143, -6, 1531], [144, -6, 1549], [145, -6, 1566], [146, -6, 1583], [146, -6, 1600], [147, -6, 1616], [149, -6, 1633], [149, -6, 1672], [150, -6, 1744], [151, -6, 1832], [152, -6, 1888], [152, -7, 1905], [153, -7, 1929], [153, -7, 1961], [154, -7, 1993], [155, -7, 2025], [155, -7, 2064], [156, -7, 2104], [157, -7, 2137], [158, -7, 2169], [158, -8, 2187], [159, -8, 2204], [160, -8, 2222], [161, -8, 2239], [162, -8, 2257], [163, -8, 2274], [164, -8, 2292], [165, -9, 2309], [167, -9, 2325], [168, -9, 2343], [169, -9, 2359], [169, -9, 2378], [170, -9, 2394], [171, -9, 2417], [172, -9, 2441], [172, -9, 2473], [173, -9, 2497], [173, -10, 2514], [174, -10, 2537], [175, -10, 2600], [176, -10, 2672], [177, -10, 2752], [177, -10, 2824], [177, -11, 2857], [178, -11, 2952], [179, -11, 3176], [179, -12, 3728], [179, -13, 3768], [179, -14, 3801], [178, -14, 3818], [178, -15, 3837], [177, -16, 3852], [176, -16, 3870], [176, -17, 3887], [176, -18, 3913], [175, -18, 3930], [175, -17, 4256], [175, -17, 4328], [175, -16, 4424], [176, -16, 6124], [177, -16, 6149], [178, -16, 6180], [178, -15, 6197], [179, -15, 6252], [179, -14, 6270], [179, -13, 6348], [179, -14, 6852], [180, -14, 6916], [181, -14, 6996], [182, -14, 7084], [182, -15, 7180], [183, -15, 7204], [183, -15, 7732], [184, -15, 8212], [183, -15, 8415], [182, -15, 8428], [182, -15, 8498]];


var request = require('request-promise');
var co = require('co');
var crypto = require('crypto');
var req = request.defaults({
  jar: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
  }
});
var calcOffset = require('./imageUtils');
var cheerio = require('cheerio');
var captcha = require('./captcha');

co(function*() {
  let html = yield req({
    uri: 'http://www.guahao.com/register/mobile',
    method: 'GET'
  });
  let $ = cheerio.load(html);
  const csrfToken = $('[name=csrf_token]').val();
  console.log('get csrf: ', csrfToken);

  let mobileValidCode = html.match(/mobilevalidcodepwd\s:\s\'(.*)\',/)[1];

  console.log('get mobile valid code', mobileValidCode);

  //init geetest
  let time = Date.now();
  let config = yield req({
    uri: 'http://www.guahao.com/geetest/start?_=' + time,
    json: true
  });
  config = JSON.parse(config);

  //从geetest得到相关信息
  let geConfig = yield req({
    uri: 'http://api.geetest.com/get.php',
    qs: {
      gt: config.gt,
      challenge: config.challenge,
      product: 'float',
      offline: false,
      sandbox: true,
      callback: 'geeTestInit'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
      'Referer': 'http://www.guahao.com/register/mobile'
    }
  });
  // console.log(geConfig);
  // geConfig = geConfig.match(/geeTestInit\((.*false}),true/)[1];
  geConfig = JSON.parse(geConfig.substring(12, geConfig.length - 1));
  const geetestImagePrefix = 'http://static.geetest.com/';
  let gt = geConfig.gt,
    challenge = geConfig.challenge,
    bg = geetestImagePrefix + geConfig.bg,
    fullbg = geetestImagePrefix + geConfig.fullbg;

  // calc offset x
  let offset = yield calcOffset(bg, fullbg);
  console.log('get offset: ', offset);
  console.log('m:', offset.x - 6);

  let inJson = yield getLine('iii');
  P.e[a.id].arr = JSON.parse(inJson);

  let finishTime = P.e[a.id].arr[P.e[a.id].arr.length - 1][2];
  let postData = {
    gt,
    challenge,
    userresponse: aa._(P.e[a.id].arr[P.e[a.id].arr.length - 1][0], challenge),
    passtime: finishTime,
    imgload: offset.t,
    a: ma.Z(a.id),
    callback: 'geetest_' + Date.now()
  };
  console.log('data to post', postData);
  let checkRes = yield req({
    uri: 'http://api.geetest.com/ajax.php',
    method: 'GET',
    qs: postData,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
      'Referer': 'http://www.guahao.com/register/mobile',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      'Cache-Control': 'max-age=0',
      'Host': 'api.geetest.com'
    },
    gzip: true
  });
  console.log('get check res: ', JSON.stringify(checkRes));
  checkRes = JSON.parse(checkRes.slice(22,-1));
  if(!checkRes.success){
    console.error('validate fail')
    process.exit(-2);
  }
  let validate = checkRes.validate;
  let validateRes = yield req({
    uri: 'http://www.guahao.com/json/white/register/mobile',
    method: 'GET',
    qs : {
      mobile: '13148405302',
      geetest_challenge: challenge,
      geetest_validate: validate,
      geetest_seccode: validate+'|jordan',
      imgCaptcha:'',
      captchaType:'geetest',
    },
    headers:{
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
      'Referer': 'http://www.guahao.com/register/mobile',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      'Cache-Control': 'no-cache',
      'Content-Type':'application/json;charset=UTF-8'
    },
    gzip: true
  });
  console.log('validate res: ',validateRes);
  //注册表单
  let phone = '13148405302';
  let signData = crypto.createHash('md5').update("REG_MOBILE" + phone + mobileValidCode).digest('hex');
  let sendResult = yield request({
    uri: `http://www.guahao.com/validcode/json/send/${phone}/REG_MOBILE/${signData}/123`,
    method: 'GET',
    qs: {
      geetest_challenge: challenge,
      geetest_validate: validate,
      geetest_seccode: validate+'|jordan',
      resend: 0,
      imgCaptcha:'',
      captchaType: 'geetest',
      _: Date.now()
    },
    headers:{
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
      'Referer': 'http://www.guahao.com/register/mobile',
      'Accept':'application/json, text/javascript, */*; q=0.01',
      'Host':'www.guahao.com',
      'Cache-Control':'no-cache'
    },
    gzip : true
  });
  console.log('send res', sendResult);
  //发送注册信息

  let smsCode = yield getLine('code');
  let registerResult = yield req({
    method: 'POST',
    url: 'http://www.guahao.com/register/verify',
    form: {
      csrf_token: csrfToken,
      action: 'register',
      loginIdType: 1,
      mobile: null || '13148405302',
      geetest_challenge: challenge,
      geetest_validate: validate,
      geetest_seccode: validate+'|jordan',
      mobileImgCode: smsCode,
      code: '',
      mobile_alias: '13148405302',
      password: 'xxxxxx',
    },
    headers:{
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });

  console.log('register res: ', registerResult);

}).catch(e => {
  console.error(e);
  console.error(e.stack);
});