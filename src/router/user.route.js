const Router = require('koa-router');
const { register, login, sendRegisterCode } = require('../controller/user.controller');
const { userInfoValidator, checkIfUserExists, cryptPassword, checkVerifyCode } = require('../middleware/user.middleware');

const router = new Router({prefix: '/users'});

router.get('/', (ctx, next) => {
  ctx.body = 'this is users';
});

// 用户注册
router.post('/register', userInfoValidator, checkIfUserExists, checkVerifyCode, cryptPassword, register);
// 请求邮箱验证码（注册用）
router.post('/register/email', sendRegisterCode);

// 用户登录(密码)
router.post('/login', login);

// 用户登录(密码)
router.post('/loginby')

module.exports = router;