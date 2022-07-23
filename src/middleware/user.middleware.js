const { getUserInfo } = require('../service/user.service');
const { 
  userInfoFormatError,
  userExisted,
  userRegisterError,
  VerifyCodeExpired,
  VerifyCodeError,
  userUnexisted,
  userLoginErro,
  userPasswordError
} = require('../constant/error.type');
const bcrypt = require('bcryptjs');

// 检测用户注册信息是否为空
const userInfoValidator = async (ctx, next) => {
  const { user_name, email, password, verify_code } = ctx.request.body;

  if (!user_name || !email || !password || !verify_code) {
    console.error('用户注册信息有误', ctx.request.body);
    ctx.app.emit('error', userInfoFormatError, ctx);
    return false;
  }
  await next();
}

// 检测注册用户 email 是否已存在
const checkRegisterUserExists = async (ctx, next) => {
  const { email } = ctx.request.body;
  let userInfoSQL = {};
  // 根据邮箱查询用户信息
  try {
    userInfoSQL = await getUserInfo({ email });
  } catch (error) {// 捕获到错误，提交错误
    console.error(error);
    ctx.app.emit('error', userRegisterError, ctx);
    return false;
  }
  // 用户已存在，提交错误
  if (userInfoSQL) {
    console.error('邮箱已存在', email);
    ctx.app.emit('error', userExisted, ctx);
    return false;
  }
  await next();
}

// 检测登录用户 email 是否存在
const checkLoginUserExists = async (ctx, next) => {
  const { email } = ctx.request.body;
  //  根据邮箱查询用户信息
  let userInfoSQL = {};
  try {
    userInfoSQL = await getUserInfo({ email });
  } catch (error) {// 捕获到错误，提交错误
    console.error(error);
    ctx.app.emit('error', userLoginErro, ctx);
    return false;
  }
  // 用户不存在，提交错误
  if (!userInfoSQL) {
    console.error('该邮箱未注册', { email });
    ctx.app.emit('error', userUnexisted, ctx);
    return false;
  }
  // 用户存在，则将其信息保存至 ctx.request.body，以便后续使用
  ctx.request.body.userInfoSQL = userInfoSQL;
  await next();
}

// 对用户密码加密
const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;

  await next();
}

// 检查邮箱验证码是否正确
const checkVerifyCode = async (ctx, next) => {
  const { email, verify_code } = ctx.request.body;
  const verifyCodeCrypted = ctx.cookies.get('verifyCode');
  // 检查 cookie 中是否存在已加密的验证码
  if (!verifyCodeCrypted) {
    console.error('验证码已过期', email, verify_code);
    ctx.app.emit('error', VerifyCodeExpired, ctx);
    return false;
  }
  // 检查用户提交的验证码和 cookie 中已加密的验证码是否匹配
  if (!bcrypt.compareSync(email + verify_code, verifyCodeCrypted)) {
    console.error('验证码错误', email, verify_code);
    ctx.app.emit('error', VerifyCodeError, ctx);
    return false;
  }
  // 验证码无误，后续不需要在使用这个验证码，所以需要清除 cookie 中已加密的验证码
  ctx.cookies.set('verifyCode', '', { maxAge: 0 });
  
  await next();
}

// 验证登录密码
const verifyLoginPassword = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const { userInfoSQL } = ctx.request.body;
  // 使用 bcrypt 验证密码
  if (!bcrypt.compareSync(password, userInfoSQL.password)) {
    console.error('密码错误', email);
    ctx.app.emit('error', userPasswordError, ctx);
    return false;
  }

  await next();
}

module.exports = {
  userInfoValidator,
  checkRegisterUserExists,
  checkLoginUserExists,
  cryptPassword,
  checkVerifyCode,
  verifyLoginPassword,
}