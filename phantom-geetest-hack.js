'use strict';

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.onConsoleMessage = function (msg) {
  console.log('brower info: ' + msg);
};
page.open('http://www.guahao.com/register/mobile', function (status) {
  if (status !== 'success') {
    console.log('get page fail');
    phantom.exit();
  }
  setTimeout(function () {
    page.evaluate(function () {
      console.log(' draw background image on canvas');
      // get backgroundImage from div
      var bg = document.querySelectorAll('div.gt_cut_bg_slice')[0];
      console.log('bg ele', bg);
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

      imageObj.onload = function () {
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
        //crop image every from given background-position and draw to canvas 
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

      /*
      deprecated 
      //dispatch event, drag the knob
      var ev = document.createEvent('MouseEvents');
      ev.initEvent('mouseover', true, false);
      var knob = document.querySelector('div.gt_slider_knob.gt_show');
     
      var evResult = knob.dispatchEvent(ev);
      console.log(knob, 'get ev result', evResult);
      return $('div.gt_slider_knob.gt_show').offset();
      */
    }); // js evaluate end

    setTimeout(function () {
      console.log('calc x offset of knob');
      var pos = page.evaluate(function () {
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
            if ((isTopBlue && bottom_r < 30 && bottom_b< 100) || (isTopWhile && bottom_r< top_r- 50 && bottom_g< top_g- 50 && bottom_b < top_r- 50)) {
              linePoints.push({x: x, y: y});
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
              return linePoints[0];
            }
            points.push(linePoints);
            linePoints = [];
          }
        }

      });
      if (!pos) {
        console.error('cannnot detect');
        page.render('web/fail-' + Date.now() + '.png');
        phantom.exit();
      }
      console.log('get pos', pos.x, pos.y);
      page.sendEvent('mousedown', 215, 148);

      var i ;
      for (i = 0; i < (pos.x - 6) / 10; i++) {
        (function (c) {
          setTimeout(function () {
            page.sendEvent('mousemove', 215 + 10 * c, 148);
            console.log('i: ', 'po', 4 * c);
            page.render('mouse-moved-'+c+'-' + Date.now() + '.png');
          }, 100 * c);
        })(i);
      }
      setTimeout(function () {
        page.sendEvent('mousemove', 215 + pos.x-6, 148);
        page.render('mouse-moved-last-' + Date.now() + '.png');
        setTimeout(function () {
          page.sendEvent('mouseup', 215 + pos.y-6, 148);
          page.render('mouse-up-' + Date.now() + '.png');
        }, 30);
        setTimeout(function () {
          page.render('mouse-over-' + Date.now() + '.png');
          page.sendEvent('click', 215, 178);
          page.render('next-' + Date.now() + '.png');
          phantom.exit();
        }, 300);
      }, 100 * (i + 2));
    }, 2000);

  }, 4000);
});
