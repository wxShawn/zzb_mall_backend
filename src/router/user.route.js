const Router = require('koa-router');
const { register, login } = require('../controller/user.controller');
const { userInfoValidator, checkIfUserExists } = require('../middleware/user.middleware');

const router = new Router({prefix: '/users'});

router.get('/', (ctx, next) => {
  ctx.body = 'this is users';
});

// 用户注册
router.post('/register', userInfoValidator, checkIfUserExists, register);

// 用户登录
router.post('/login', login);

module.exports = router;