'use strict';

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
var path_124 = [
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


let offsetX = 183,
  gt = 'c9e986509b0a07b24a5463ded32b9d50',
  challenge = 'ca9c5e62c623b1811a490f701a345d4d';

var postData = {
  gt,
  challenge,
  imgload: 2077,
  passtime: 5040,
  userresponse: aa._(offsetX, challenge),
  a: ma.Z(a.id)
};


//var url = 'http://api.geetest.com/ajax.php?';
//
//for(var key in postData){
//  url += [key,postData[key]].join('=')+'&';
//}
//url += 'callback=geetest_1460123774640';
//console.log(url);

//var request = require('request');
var request = require('request-promise');
var co = require('co');
var req = request.defaults({
  jar: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36;'
  },
});
var calcOffset = require('./imageUtils');
//import calOffset from './imageUtils';

co(function*() {
  let html = yield req({
    uri: 'http://www.guahao.com/register/mobile',
    method: 'GET'
  });
  let time = Date.now();
  let config = yield req({
    uri: 'http://www.guahao.com/geetest/start?_=' + time,
    json: true,
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
      sandbox: true
      //callback: 'geetest_'+ time
    }
  });
  geConfig = geConfig.match(/Geetest\((.*false}),true/)[1];
  geConfig = JSON.parse(geConfig);
  const geetestImagePrefix = 'http://static.geetest.com/';
  let gt = geConfig.gt,
    challenge = geConfig.challenge,
    bg = geetestImagePrefix + geConfig.bg,
    fullbg = geetestImagePrefix + geConfig.fullbg;

  // calc offset x
  let offset = yield calcOffset(bg, fullbg);
  console.log('get offset: ', offset);

  // post
  P.e[a.id].arr = path_183.filter(arr=> arr[0] <= Math.floor(0.7 * (offset.x - 6)));
  while (P.e[a.id].arr.slice(-1)[0][0] < offset.x - 6) {
    P.e[a.id].arr.push([P.e[a.id].arr.slice(-1)[0][0] + Math.floor(2*Math.random()+1), 0, P.e[a.id].arr.slice(-1)[0][2] + Math.floor(Math.random()*(30-15)+15)]);
  }
  console.log(JSON.stringify(P.e[a.id].arr));

  let finishTime = P.e[a.id].arr.slice(-1)[0][2];
  //P.e[a.id].arr.push(offset.x-6,0,finishTime)
  let postData = {
    gt,
    challenge,
    imgload: 900,
    passtime: finishTime,
    userresponse: aa._(offset.x - 6, challenge),
    a: ma.Z(a.id)
  };
  console.log('data to post', JSON.stringify(postData));
  let checkRes = yield req({
    uri: 'http://api.geetest.com/ajax.php',
    method: 'GET',
    referer: 'http://www.guahao.com/register/mobile',
    qs: postData
  });
  console.log('get check res: ', JSON.stringify(checkRes));
});


