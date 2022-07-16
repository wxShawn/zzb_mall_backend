const { getUserInfo } = require('../service/user.service');
const { userInfoFormatError, userExisted, userRegisterError } = require('../constant/error.type');

// 检测用户名或密码是否为空
const userInfoValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;

  if (!user_name || !password) {
    ctx.app.emit('error', userInfoFormatError, ctx);
    return false;
  }
  await next();
}

// 检测用户是否已存在
const checkIfUserExists = async (ctx, next) => {
  const { user_name } = ctx.request.body;
  try {
    const userInfo = await getUserInfo({ user_name });
    if (userInfo) {
      console.error('用户名已存在', userInfo);
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

module.exports = {
  userInfoValidator,
  checkIfUserExists,
}