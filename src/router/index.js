const Router = require('koa-router');
const adminRouter = require('./admin.route');
const roleRouter = require('./role.route');

const router = new Router();
router.use(adminRouter.routes());
router.use(roleRouter.routes());

module.exports = router;