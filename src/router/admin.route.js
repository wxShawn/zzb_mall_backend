const Router = require('koa-router');
const {
  register,
  login,
  modifyPassword,
  deleteAdmin,
  updateAdmin,
  getAdminList,
  getPersonalInfo
} = require('../controller/admin.controller');
const { sendVerifyCode } = require('../controller/emailVerify.controller');
const {
  checkAdminExists,
  checkAdminRegisterParams,
  cryptPassword,
  checkPwdLogin,
  checkAdminUpdateParams,
  checkModifyPwdParams,
  checkEmailCodeLoginParams,
  checkFilterParams
} = require('../middleware/admin.middleware');
const Auth = require('../middleware/auth.middleware');
const { checkEmailVerifyCode } = require('../middleware/emailVerify.middleware');

const adminRouter = new Router({prefix: '/admins'});

// 管理员注册（超级管理员）未设置权限
adminRouter.post('/register', checkAdminRegisterParams, cryptPassword, register);

// 删除管理员（超级管理员）未设置权限
adminRouter.delete('/:id', deleteAdmin);

// 修改管理员信息（超级管理员）未设置权限
adminRouter.put('/:id', checkAdminUpdateParams, cryptPassword, updateAdmin);

// 获取所有管理员信息（超级管理员）未设置权限
adminRouter.get('/', checkFilterParams, getAdminList);


// 管理员登录（密码）（个人）done
adminRouter.post('/login', checkPwdLogin, login);

// 管理员登录（邮箱验证码）（个人）done
adminRouter.post('/login/email-code', checkEmailCodeLoginParams, checkEmailVerifyCode, login);

// 请求获取登录验证码（个人）done
adminRouter.get('/login/email-code', checkAdminExists, sendVerifyCode);

// 修改密码（个人）done
adminRouter.patch('/password', new Auth().verifyAuth, checkModifyPwdParams, checkEmailVerifyCode, cryptPassword, modifyPassword);

// 请求获取修改密码验证码（个人）done
adminRouter.get('/password/email-code', new Auth().verifyAuth, sendVerifyCode);

// 获取个人信息（个人）done
adminRouter.get('/personal', new Auth().verifyAuth, getPersonalInfo);


module.exports = adminRouter;