const Router = require('koa-router');
const { register, login, sendVerifyCode } = require('../controller/user.controller');
const {
  userInfoValidator,
  checkRegisterUserExists,
  checkLoginUserExists,
  cryptPassword,
  checkVerifyCode,
  verifyLoginPassword,
} = require('../middleware/user.middleware');

const router = new Router({prefix: '/users'});

router.get('/', (ctx, next) => {
  ctx.body = 'this is users';
});

// 用户注册
router.post('/register', userInfoValidator, checkRegisterUserExists, checkVerifyCode, cryptPassword, register);
// 请求邮箱验证码（注册用）
router.post('/register/email', checkRegisterUserExists, sendVerifyCode);

// 用户登录(密码)
router.post('/login', checkLoginUserExists, verifyLoginPassword, login);
// 用户登录(邮箱验证码)
router.post('/login/vrifycode', checkLoginUserExists, checkVerifyCode, login);
// 请求邮箱验证码（登录用）
router.post('/login/email', checkLoginUserExists, sendVerifyCode);

module.exports = router;