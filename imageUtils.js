'use strict';
var co = require('co');
var jimp = require('jimp');

module.exports = function  calcOffset (bg_url, full_url){
  return jimp.read(bg_url).then(bg=>{
    return jimp.read(full_url).then(fullbg => {
      let arr = [[-157, -58],
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
      function drawRegion(image,imageCrop,sx, sy, dx, dy) {
        image.blit(imageCrop, dx, dy, sx, sy, 10, 58);
      }
      function drawImage(image,imageCrop,resolve){
        let i = 0, dx = 0, dy = 0;
        for(; i < arr.length; i++) {
          drawRegion(image,imageCrop,-1 * arr[i][0], -1 * arr[i][1], dx, dy);
          dx += 10;
          if (dx === 260) {
            dx = 0;
            dy = 58;
          }
        }
        resolve(image);
      }
      function genImage(cropImage){
        return new Promise((resolve,reject)=>{
          new jimp(260, 116, (err,image) =>{
            if(err)
              reject(err.stack);
            drawImage(image,cropImage,resolve)
          } );
        })
      }
      return co(function*(){
        let imageBg =  yield genImage(bg);
        imageBg.write('promiseBg.jpg');
        let imageBgFull =  yield genImage(fullbg);
        imageBgFull.write('promiseBgFull.jpg');
        let diff = jimp.diff(imageBg,imageBgFull);
        diff.image.write('diff_image.jpg');
        let data = diff.image.bitmap.data;
        let w = diff.image.bitmap.width;
        let h = diff.image.bitmap.height;
        for (let y = 0; y < h; y++) {
          let linePoint =[];
          for (let x = 0; x < w; x++) {
            let index = (x + y * w) * 4;
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];
            if(r>250 && g<50 && b<50) {
              linePoint.push({x,y})
              //return Promise.resolve({x,y})
            }
          }
          console.log('lp len: ',linePoint.length);
          if(linePoint.length>20){
            return Promise.resolve(linePoint[0]);
          }
          linePoint=[];
        }
        return Promise.resolve({x:0,y:0})
      });
    }).catch(err=> console.err(err.stack))
  })
};
//var x = calcOffset('http://static.geetest.com/pictures/gt/df4b23de2/bg/73fc07001.jpg','http://static.geetest.com/pictures/gt/df4b23de2/df4b23de2.jpg');
//x.then(res=> JSON.stringify(res));

