const { userRegisterError } = require('../constant/error.type');
const { createUser } = require('../service/user.service');

class UserController {
  // 用户注册
  async register(ctx, next) {
    const { user_name, password } = ctx.request.body;
    
    try {
      const res = await createUser(user_name, password);
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: res.id,
          user_name: res.user_name,
        }
      }
    } catch (error) {// 捕获到错误，提交错误
      console.error(error);
      ctx.app.emit('error', userRegisterError, ctx);
    }
    
  }

  // 用户登录
  async login(ctx, next) {
    const { user_name, password } = ctx.request.body;
    ctx.body = `登录成功: ${user_name}, ${password}`;
  }
}

module.exports = new UserController();