const bcrypt = require('bcryptjs');
const response = require('../app/response');
const emailVerifyService = require("../service/emailVerify.service");

module.exports = {
  // 检查邮箱和验证码
  async checkEmailVerifyCode(ctx, next) {
    const { email, verify_code } = ctx.state;
    // 查询数据库中的验证码
    const getVerifyCodeCrypted = await emailVerifyService.getOneByEmail(email);
    // 返回的值为空时，说明数据库中没有对应邮箱的验证码，验证码已过期
    if (!getVerifyCodeCrypted) {
      return response.error(ctx, {
        status: 400,
        message: '验证码已过期',
        result: ''
      });
    }
    
    const verifyCodeCrypted = getVerifyCodeCrypted.verify_code;
    // 检查用户提交的"邮箱+验证码"和 cookie 中已加密的"邮箱+验证码"是否匹配
    if (!bcrypt.compareSync(verify_code, verifyCodeCrypted)) {
      return response.error(ctx, {
        status: 400,
        message: '验证码错误',
        result: ''
      });
    }
    
    // 验证完成，删除验证码
    await emailVerifyService.remove(email);
    
    await next();
  }
}