const { getUserInfo } = require('../service/user.service');
const { userInfoFormatError, userExisted, userRegisterError } = require('../constant/error.type');
const bcrypt = require('bcryptjs');

// 检测用户注册信息是否为空
const userInfoValidator = async (ctx, next) => {
  const { user_name, email, password } = ctx.request.body;

  if (!user_name || !email || !password) {
    console.error('用户注册信息有误', ctx.request.body);
    ctx.app.emit('error', userInfoFormatError, ctx);
    return false;
  }
  await next();
}

// 检测用户email是否已存在
const checkIfUserExists = async (ctx, next) => {
  const { email } = ctx.request.body;
  try {
    const userInfo = await getUserInfo({ email });
    if (userInfo) {
      console.error('邮箱已存在', { email });
      ctx.app.emit('error', userExisted, ctx);
      return false;
    }
  } catch (error) {// 捕获到错误，提交错误
    console.error(error);
    ctx.app.emit('error', userRegisterError, ctx);
    return false;
  }

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

module.exports = {
  userInfoValidator,
  checkIfUserExists,
  cryptPassword,
}