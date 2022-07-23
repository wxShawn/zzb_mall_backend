const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('../router');
const cors = require('koa2-cors')

const app = new Koa();

app.use(cors({
  origin: ctx => { return 'http://localhost:3000' },
}));

app.use(koaBody());

// 路由
app.use(router.routes());

module.exports = app;