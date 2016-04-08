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

P.e[a.id].arr = [
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
  [121, 0, 1441],
  [183,0,3040]
];

let offsetX = 183,
  gt = 'c9e986509b0a07b24a5463ded32b9d50',
  challenge = 'ca9c5e62c623b1811a490f701a345d4d';

var postData = {  
  gt,
  challenge,
  imgload: 2077,
  passtime: 5040,
  userresponse: aa._(offsetX, challenge),
  a:  ma.Z(a.id)
};


var url = 'http://api.geetest.com/ajax.php?';

for(var key in postData){
  url += [key,postData[key]].join('=')+'&';
}
url += 'callback=geetest_1460123774640';
console.log(url);

var request = require('request');
var req = request.defaults({jar: true });
req.get({
  url,
  headers:{
    referer: 'http://www.guahao.com/register/mobile'
  } 
}, (err,response,body)=>{
  console.log('body', body);
});

/*

  curl -e   -> referer
  -v verbose info
*/

