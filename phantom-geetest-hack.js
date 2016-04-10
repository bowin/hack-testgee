'use strict';

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.onConsoleMessage = function(msg) {
  console.log('brower info: ' + msg);
};
var gt = null, challenge = null;
page.onResourceReceived = function(response) {
  if (!gt) {
    var str = JSON.stringify(response);
    // console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
    var res = str.match(/gt=(.*)&challenge=(.*)&/);
    console.log('match gt', res);
    if (res && res[1]) {
      gt = res[1].trim();
      console.log('gt=', gt);
      //jsonp
      page.evaluate(function(url) {
        console.log('get url', url);
        // $.ajax({
        //   type: 'get',
        //   async: false,
        //   url: 'http://api.geetest.com/get.php?' + url,
        //   dataType: 'jsonp',
        //   jsonp: 'callback',//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        //   jsonpCallback: 'geetest_1460123774640',//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        //   success: function(json) {
        //     console.log('jsop return', JSON.stringify(json));
        //   },
        //   error: function(err) {
        //     console.log('jsonp error', err);
        //   }
        // });
        window.handler = function(data) {
          console.log('get jsonp return: ',JSON.stringify(data));
        };
        // 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
        var urll = 'http://api.geetest.com/get.php?'+url+'&callback=handler';
        // 创建script标签，设置其属性
        var script = document.createElement('script');
        script.setAttribute('src', urll);
        // 把script标签加入head，此时调用开始
        document.getElementsByTagName('head')[0].appendChild(script);
      }, res[0].slice(0, -1));
    }
  }
};

page.open('http://www.guahao.com/register/mobile', function(status) {
  if (status !== 'success') {
    console.log('get page fail');
    phantom.exit();
  }
  setTimeout(function() {
    page.evaluate(function(gt, challenge) {
      console.log('get gt=', gt, 'challenge=', challenge);
      console.log(' draw background image on canvas');
      // get backgroundImage from div
      var bg = document.querySelectorAll('div.gt_cut_bg_slice')[0];
      var bgUrl = bg.style['backgroundImage'];
      bgUrl = bgUrl.slice(4, -1);
      // create canvas, draw image to be detected
      var canvas = document.createElement('canvas');
      canvas.id = 'my-canvas';
      canvas.width = 260;
      canvas.height = 116;
      canvas.style.zIndex = 2000;
      var context = canvas.getContext('2d');
      var imageObj = new Image();

      imageObj.onload = function() {
        // background-position of 52 divs 
        var arr = [[-157, -58],
          [-145, -58],
          [-265, -58],
          [-277, -58],
          [-181, -58],
          [-169, -58],
          [-241, -58],
          [-253, -58],
          [-109, -58],
          [-97, -58],
          [-289, -58],
          [-301, -58],
          [-85, -58],
          [-73, -58],
          [-25, -58],
          [-37, -58],
          [-13, -58],
          [-1, -58],
          [-121, -58],
          [-133, -58],
          [-61, -58],
          [-49, -58],
          [-217, -58],
          [-229, -58],
          [-205, -58],
          [-193, -58],
          [-145, 0],
          [-157, 0],
          [-277, 0],
          [-265, 0],
          [-169, 0],
          [-181, 0],
          [-253, 0],
          [-241, 0],
          [-97, 0],
          [-109, 0],
          [-301, 0],
          [-289, 0],
          [-73, 0],
          [-85, 0],
          [-37, 0],
          [-25, 0],
          [-1, 0],
          [-13, 0],
          [-133, 0],
          [-121, 0],
          [-49, 0],
          [-61, 0],
          [-229, 0],
          [-217, 0],
          [-193, 0],
          [-205, 0]];

        function drawRegion(sx, sy, dx, dy) {
          context.drawImage(imageObj, sx, sy, 10, 58, dx, dy, 10, 58);
        }
        //crop image from given background-position and draw to canvas 
        var i = 0, dx = 0, dy = 0;
        for (i; i < arr.length; i++) {
          drawRegion(-1 * arr[i][0], -1 * arr[i][1], dx, dy);
          dx += 10;
          if (dx === 260) {
            dx = 0;
            dy = 58;
          }

        }
        // draw canvas on document
        document.querySelector('div.tab-main.g-clear.J_TabMain').appendChild(canvas);
      };

      imageObj.crossOrigin = 'Anonymous';
      imageObj.src = bgUrl;
      // document.querySelector('div.gt_slider_knob.gt_show').addEventListener('mousemove',function(e){
      //   //console.log(e.clientX, e.clientY, e.timeStamp)
      //   console.log('mouse moved',e.pageX, e.pageY, e.timeStamp);
      // });

    }, gt, challenge); // js evaluate end

    setTimeout(function() {
      console.log('calc x offset of knob');
      var pos = page.evaluate(function(gt, challenge) {
        var canvas = document.getElementById('my-canvas');
        var context = canvas.getContext('2d');
        var pixelData = context.getImageData(0, 0, 260, 116);
        var x = 0;
        var y = 0;
        var w = pixelData.width, h = pixelData.height;
        var points = [];
        var linePoints = [];
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            var index = (x + y * w) * 4;
            var r = pixelData.data[index];
            var g = pixelData.data[index + 1];
            var b = pixelData.data[index + 2];
            // left point
            var left_r = pixelData.data[index - 4];
            var left_g = pixelData.data[index - 3];
            var left_b = pixelData.data[index - 2];

            var right_r = pixelData.data[index + 4];
            var right_g = pixelData.data[index + 5];
            var right_b = pixelData.data[index + 6];

            var top_r = pixelData.data[index - (w * 4)];
            var top_g = pixelData.data[index - (w * 4) + 1];
            var top_b = pixelData.data[index - (w * 4) + 2];

            var bottom_r = pixelData.data[index + (w * 4)];
            var bottom_g = pixelData.data[index + (w * 4 + 1)];
            var bottom_b = pixelData.data[index + (w * 4 + 2)];

            var isTopBlue = top_r <= 30 && top_b >= 220;
            var isTopWhile = top_r >= 220 && top_g >= 220 && top_b >= 220;
            if ((isTopBlue && bottom_r < 30 && bottom_b < 100) || (isTopWhile && bottom_r < top_r - 50 && bottom_g < top_g - 50 && bottom_b < top_r - 50)) {
              linePoints.push({ x: x, y: y });
              // draw on canvas
              context.beginPath();
              context.arc(x, y, 1, 1, 2 * Math.PI, false);
              context.fillStyle = 'red';
              context.fill();
              context.beginPath();
            }

          }
          if (linePoints.length) {
            console.log('lp length', linePoints.length);
            if (linePoints.length > 15) {
              // return linePoints[0];
              var P = {};
              P.e = {};
              P.f = function(a, b) {
                P.e[a] = {}, P.e[a].self = b
              };
              P.o = function(a, b, c) {
                return P.e[c][a] = b, b
              };
              P.l = function(a, b) {
                return P.e[b][a]
              };

              var ma = function() {
                var a = function(a, b) {
                  P.o("arr", [a], b)
                };
                var b = function(a, b) {
                  P.l("arr", b).push(a)
                };
                var c = function(a) {
                  for (var b = [], c = 0, d = a.length - 1; d > c; c++) {
                    var e = [];
                    e[0] = Math.round(a[c + 1][0] - a[c][0]), e[1] = Math.round(a[c + 1][1] - a[c][1]), e[2] = Math.round(a[c + 1][2] - a[c][2]), 0 === e[0] && 0 === e[1] && 0 === e[2] || b.push(e)
                  }
                  return b
                };

                var d = function(a) {
                  var b = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr", c = b.length, d = "", e = Math.abs(a), f = parseInt(e / c);
                  f >= c && (f = c - 1), f && (d = b.charAt(f)), e %= c;
                  var g = "";
                  return 0 > a && (g += "!"), d && (g += "$"), g + d + b.charAt(e)
                };

                var e = function(a) {
                  for (var b = [[1, 0], [2, 0], [1, -1], [1, 1], [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]], c = "stuvwxyz~", d = 0, e = b.length; e > d; d++)if (a[0] == b[d][0] && a[1] == b[d][1]) return c[d];
                  return 0
                };

                var f = function(a) {
                  for (var b, f = c(P.l("arr", a)), g = [], h = [], i = [], j = 0, k = f.length; k > j; j++)b = e(f[j]), b ? h.push(b) : (g.push(d(f[j][0])), h.push(d(f[j][1]))), i.push(d(f[j][2]));
                  return g.join("") + "!!" + h.join("") + "!!" + i.join("")
                };
                return { Z: f, W: b, p: a }
              } ();

              var aa = {};
              aa._ = function(a, b) {
                for (var c = b.slice(32), d = [], e = 0; e < c.length; e++) {
                  var f = c.charCodeAt(e);
                  d[e] = f > 57 ? f - 87 : f - 48;
                }
                c = 36 * d[0] + d[1];
                var g = Math.round(a) + c;
                b = b.slice(0, 32);
                var h, i = [[], [], [], [], []], j = {}, k = 0;
                e = 0;
                for (var l = b.length; l > e; e++)h = b.charAt(e), j[h] || (j[h] = 1, i[k].push(h), k++ , k = 5 == k ? 0 : k);
                for (var m, n = g, o = 4, p = "", q = [1, 2, 5, 10, 50]; n > 0;)n - q[o] >= 0 ? (m = parseInt(Math.random() * i[o].length, 10), p += i[o][m], n -= q[o]) : (i.splice(o, 1), q.splice(o, 1), o -= 1);
                return p;
              };
              var a = { id: 1460105955100 };
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
                [183, 0, 3040]
              ];
              // jsonp reqest to verify 
              var offset = linePoints[0];
              console.log('get offset', JSON.stringify(offset));
              console.log('user response: ', aa._(offset.x - 6, challenge));
              var postData = {
                gt: gt,
                challenge: challenge,
                imgload: 2077,
                passtime: 5040,
                userresponse: aa._(offset.x - 6, challenge),
                a: ma.Z(a.id)
              };
              var url = 'http://api.geetest.com/ajax.php?';

              for (var key in postData) {
                url += [key, postData[key]].join('=') + '&';
              }
              url = url.slice(0, -1);
              console.log(url);
              // jsonp
              // $.ajax({
              //   type: "get",
              //   async: false,
              //   url: url,
              //   dataType: "jsonp",
              //   jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
              //   jsonpCallback: "geetest_1460123774640",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
              //   success: function(json) {
              //     console.log('res',JSON.stringify(json));
              //   },
              //   error: function(err) {
              //     console.log('jsonp error', err);
              //   }
              // });
              return linePoints[0];
            }
            points.push(linePoints);
            linePoints = [];
          }
        }

      }, gt, challenge);
      if (!pos) {
        console.error('cannnot detect');
        page.render('web/fail-' + Date.now() + '.png');
        phantom.exit();
      }
      console.log('get pos', pos.x, pos.y);

      // page.sendEvent('mousemove', 215, 148);
      // page.sendEvent('mousedown', 215, 148);

      // var i;
      // for (i = 0; i < (pos.x - 6); i++) {
      //   (function(c) {
      //     setTimeout(function() {
      //       page.sendEvent('mousemove', 215 + c, 148);
      //       // console.log('i: ', 'po', c);
      //       // page.render('mouse-moved-'+c+'-' + '.png');
      //     }, 17 * c);
      //   })(i);
      // }
      // setTimeout(function() {
      //   // page.sendEvent('mousemove', 215 + pos.x-6, 148);
      //   page.render('mouse-moved-last-' + '.png');
      //   setTimeout(function() {
      //     page.sendEvent('mouseup', 215 + pos.y - 6, 148);
      //     page.render('mouse-up-' + '.png');
      //   }, 30);
      //   setTimeout(function() {
      //     page.render('mouse-over-' + '.png');
      //     page.sendEvent('click', 215, 178);
      //     page.render('next-' + '.png');
      //     phantom.exit();
      //   }, 300);
      // }, 17 * (i + 2));
    }, 2000);

  }, 4000);
});
