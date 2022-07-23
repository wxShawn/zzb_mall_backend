const Router = require('koa-router');
const adminRouter = require('./admin.route');

const router = new Router();
router.use(adminRouter.routes());

module.exports = router;