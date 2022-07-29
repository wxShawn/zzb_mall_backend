const { logError, infoLogger } = require('../logger/logger.js');
const adminService = require('../service/admin.service.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.default');
const response = require('../app/response');
const { idRegExp } = require('../utils/RegExp.js');

class AdminController {

  // 管理员注册
  async register(ctx, next) {
    const res = await adminService.create(ctx.request.body);
    if (res.role_id === 1) {
      return response.error(ctx, {
        status: 400,
        message: '无法注册超级管理员',
        result: '',
      });
    }
    const { password, ...adminInfo } = await adminService.getOne(res.id);
    // 记录日志
    infoLogger.info('注册成功', adminInfo); 
    // 响应成功
    response.success(ctx, {
      status: 201,
      message: '注册成功',
      result: adminInfo,
    });
  }


  // 删除管理员
  async deleteAdmin(ctx, next) {
    const { id } = ctx.params;
    if (!id || !idRegExp.test(id)) {
      return response.error(ctx, {
        status: 400,
        message: '无效请求参数',
        result: '',
      });
    }
    const adminInfo = await adminService.getOne(id);
    if (!adminInfo) {
      return response.error(ctx, {
        status: 404,
        message: '该管理员不存在！',
        result: '',
      });
    }
    if (adminInfo.zzb_role.id === 1) {
      return response.error(ctx, {
        status: 400,
        message: '无法删除超级管理员！',
        result: '',
      });
    }
    await adminService.remove(id);
    response.success(ctx, {
      status: 200,
      message: '删除成功',
      result: '',
    });
  }

  
  // 修改管理员信息
  async updateAdmin(ctx, next) {
    const { name, email, password, role_id } = ctx.request.body;
    if (role_id === 1) {
      return response.error(ctx, {
        status: 400,
        message: '无法修改为超级管理员',
        result: '',
      });
    }
    // 将存在的字段保存到 newData 中
    let newData = {};
    name && (newData = { name, ...newData });
    email && (newData = { email, ...newData });
    password && (newData = { password, ...newData });
    role_id && (newData = { role_id, ...newData });

    const { id } = ctx.params;
    let res = await adminService.update(id, newData);
    if (res != 1) {
      return response.error(ctx, {
        status: 404,
        message: '该管理员不存在',
        result: '',
      })
    }
    return response.success(ctx, {
      status: 200,
      message: '修改成功',
      result: '',
    })
  }

  
  // 获取管理员列表
  async getAdminList(ctx, next) {
    const { name, email, role_id, page, pageSize } = ctx.request.query;
    let filter = { page: parseInt(page), pageSize: parseInt(pageSize) };
    name && (filter = { name, ...filter });
    email && (filter = { email, ...filter });
    role_id && (filter = { role_id, ...filter });
    const res = await adminService.getAll(filter);
    return response.success(ctx, {
      status: 200,
      message: '查询成功',
      result: { 
        pageCount: Math.ceil(res.count / pageSize),
        total: res.count,
        rows: res.rows,
      },
    });
  }


  // 管理员登录
  async login(ctx, next) {
    const { email } = ctx.request.body;
    const { password, ...adminInfo } = await adminService.getOneByEmail(email);
    const { id, role_id } = adminInfo;
    // 记录日志
    infoLogger.info('登录成功', adminInfo);
    // 响应成功
    response.success(ctx, {
      status: 200,
      message: '登录成功',
      result: {
        adminInfo,
        jwt: jwt.sign({ id, role_id }, JWT_SECRET, {expiresIn: '1h'}),
      },
    });
  }


  // 修改密码
  async modifyPassword(ctx, next) {
    const { password } = ctx.request.body;
    const { id } = ctx.state;
    if (!id || !password) {
      return response.error(ctx, {
        status: 400,
        message: '信息不完整，密码修改失败',
        result: '',
      });
    }
    let res = await adminService.update(id, { password });
    console.log(res);
    return response.success(ctx, {
      status: 200,
      message: '密码修改成功',
      result: '',
    });
  }


  // 获取个人信息
  async getPersonalInfo(ctx, next) {
    const { id } = ctx.state
    const { password, ...adminInfo } = await adminService.getOne(id);
    return response.success(ctx, {
      status: 200,
      message: '获取信息成功',
      result: adminInfo,
    });
  }

}

module.exports = new AdminController();