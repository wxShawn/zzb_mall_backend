const jwt = require('jsonwebtoken');
const response = require('../app/response');
const { JWT_SECRET } = require('../config/config.default');
const adminService = require('../service/admin.service');

class Auth {
  // 实例化的时候传入角色id列表，设置可访问权限
  constructor(role_id_list) {
    // 如果未传人角色id，则默认允许所有角色访问
    if (!role_id_list) {
      role_id_list = [1, 2, 3]
    }
    this.role_id_list = role_id_list;
  }

  /**
   * 验证 jwt
   */
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
    let tokenInfo = {}
    try {
      tokenInfo = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return response.error(ctx, {
        status: 401,
        message: '登录令牌失效，请重新登录',
        result: { error }
      });
    }
    const { id } = tokenInfo;
    // 根据 id 获取所有信息
    const adminInfo = await adminService.getOne(id);
    // 将信息保存到 ctx.state
    ctx.state = adminInfo;

    await next();
  }
}

module.exports = Auth;