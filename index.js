'use strict';
var path = require('path'),
  app = require('koa')(),
  Redis = require('ioredis'),
  redis = new Redis(),
  router = require('koa-router')(),
  koaBody = require('koa-body'),
  _ = require('lodash');

module.exports = app;

router.post('/offset/:index', function*(next) {
  let index = this.params.index;
  redis.lpush(`offset-${index}`, this.request.body.data);
  this.body = 'ok';
});
router.post('/offset/:index/remove', function*() {
  let index = this.params.index;
  let key = `offset-${index}`;
  let data = this.request.body.data;
  let deleteRes = yield redis.lrem(key, 1, data);
  console.log('data to delete: ',index,data)
  this.body = deleteRes ? 'delete ok' : 'delete fail';

});
//get random element of this index
router.get('/offset/:index', function*(next) {
  let index = this.params.index;
  let key = `offset-${index}`;
  let keyExisted = yield redis.exists(key);
  if (!keyExisted) {
    this.body = JSON.stringify({success: 0, error: `key ${key} not exist!`});
    return;
  }
  let len = yield redis.llen(key);
  let randomIndex = _.random(len - 1);
  let data = yield redis.lrange(key, randomIndex, randomIndex);
  this.body = JSON.stringify({success: 1, data: data[0]});
});
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(require('koa-static')(path.join(__dirname, 'web')));

app.listen(3000);
