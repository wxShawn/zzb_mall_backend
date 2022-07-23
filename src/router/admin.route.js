const Router = require('koa-router');
const { register, login, modifyPassword } = require('../controller/admin.controller');
const { sendVerifyCode } = require('../controller/emailVerify.controller');
const { checkAdminExists, checkAdminRegisterInfo, cryptPassword, checkPassword } = require('../middleware/admin.middleware');
const { verifyAuth } = require('../middleware/auth.middleware');
const { checkEmailVerifyCode } = require('../middleware/emailVerify.middleware');

const adminRouter = new Router({prefix: '/admin'});

// 管理员注册
adminRouter.post('/register', checkAdminRegisterInfo, checkAdminExists, cryptPassword, register);

// 管理员登录（密码）
adminRouter.post('/login', checkAdminExists, checkPassword, login);

// 管理员登录（邮箱验证码）
adminRouter.post('/login/email-code', checkAdminExists, checkEmailVerifyCode, login);

// 请求获取登录验证码
adminRouter.get('/login/email-code', checkAdminExists, sendVerifyCode);

// 修改密码
adminRouter.patch('/password', verifyAuth, checkEmailVerifyCode, cryptPassword, modifyPassword);

// 请求获取修改密码验证码
adminRouter.get('/password/email-code', verifyAuth, sendVerifyCode);

module.exports = adminRouter;