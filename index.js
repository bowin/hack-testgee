'use strict';
var path = require('path'),
  app = require('koa')();

app.use(require('koa-static')(path.join(__dirname, 'web')));

app.listen(3000);
