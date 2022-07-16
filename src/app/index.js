const Koa = require('koa');
const koaBody = require('koa-body');
const userRouter = require('../router/user.route');
const errorHandler = require('./error.handler');

const app = new Koa();
app.use(koaBody());

app.use(userRouter.routes());

// 统一处理错误
app.on('error', errorHandler)

module.exports = app;