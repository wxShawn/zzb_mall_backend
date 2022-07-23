const { logError, infoLogger } = require('../logger/logger.js');
const adminService = require('../service/admin.service.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
const response = require('../app/response');

class AdminController {

  // 管理员注册
  async register(ctx, next) {
    const createAdmin = await adminService.create(ctx.request.body);
    if (!createAdmin.sucsses) {
      return response.error(ctx, {
        status: 500,
        message: '注册失败！',
        result: '',
      });
    }
    
    const { password, ...adminInfo } = createAdmin.data;
    // 记录日志
    infoLogger.info('注册成功', adminInfo); 
    // 响应成功
    response.sucsses(ctx, {
      status: 201,
      message: '注册成功',
      result: adminInfo,
    });
  }


  // 管理员登录
  async login(ctx, next) {
    const { password, ...adminInfo } = ctx.state.adminInfo;
    // 记录日志
    infoLogger.info('登录成功', adminInfo);
    // 响应成功
    response.sucsses(ctx, {
      status: 200,
      message: '登录成功',
      result: {
        adminInfo,
        jwt: jwt.sign(adminInfo, JWT_SECRET, {expiresIn: '1h'}),
      },
    });
  }


  // 修改密码
  async modifyPassword(ctx, next) {
    console.log('con', ctx.request.body);
    const { password } = ctx.request.body;
    const { id } = ctx.state.adminInfo;

    let updateAdmin = await adminService.updateById(id, { password });
    if (!updateAdmin.sucsses) {
      return response.error(ctx, {
        status: 500,
        message: '密码修改失败',
        result: ''
      });
    }
    console.log(updateAdmin);
    return response.sucsses(ctx, {
      status: 200,
      message: '密码修改成功',
      result: '',
    })
  }

}

module.exports = new AdminController();