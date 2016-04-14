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
  redis.sadd(`offset-${index}`, this.request.body.data);
  this.body = 'ok';
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
  let data = yield redis.spop(key);
  this.body = JSON.stringify({success: 1, data});
});

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(require('koa-static')(path.join(__dirname, 'web')));

app.listen(3000);
