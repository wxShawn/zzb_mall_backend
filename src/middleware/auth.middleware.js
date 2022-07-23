const jwt = require('jsonwebtoken');
const response = require('../app/response');
const { JWT_SECRET } = require('../config/config.default');

module.exports = {
  async verifyAuth(ctx, next) {
    const authToken = ctx.request.header.authorization;
    // 检查 jwt 是否存在
    if (!authToken) {
      return response.error(ctx, {
        status: 401,
        message: '未登录',
        result: ''
      })
    }
    const token = authToken.replace('Bearer ', '');
    // 解析 jwt
    let adminInfo = {}
    try {
      adminInfo = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return response.error(ctx, {
        status: 401,
        message: '登录令牌无效',
        result: { error }
      });
    }
    // jwt 验证通过后，保存 adminInfo
    ctx.state.adminInfo = adminInfo;

    await next();
  }
}