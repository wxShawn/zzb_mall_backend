const { logError } = require('../logger/logger');
const { nameRegExp, emailRegExp, passwordRegExp, idRegExp, verifyCodeRegexp } = require('../utils/RegExp');
const response = require('../app/response');
const bcrypt = require('bcryptjs');
const adminService = require('../service/admin.service');

module.exports = {

  /**
   * 检查管理员注册信息是否合法
   */
  async checkAdminRegisterParams(ctx, next) {
    // 检查注册信息是否完整
    const { name, email, password, role_id } = ctx.request.body;
    if (!name || !email || !password || !role_id) {
      return response.error(ctx, {
        status: 400,
        message: '注册信息不完整',
        result: '',
      });
    }
    let check = nameRegExp.test(name) && emailRegExp.test(email) && passwordRegExp.test(password) && idRegExp.test(role_id);
    if (!check) {
      return response.error(ctx, { // 响应错误
        status: 400,
        message: '注册信息格式错误',
        result: '',
      });
    }
    // 检查邮箱是否已被注册
    if (await adminService.getOneByEmail(email)) {
      return response.error(ctx, {
        status: 409,
        message: '邮箱已被注册',
        result: { email },
      });
    };

    await next();
  },


  /**
   * 检查更新的信息是否合法
   */
  async checkAdminUpdateParams(ctx, next) {
    const { id } = ctx.request.params;
    if (!id || !idRegExp.test(id)) {
      return response.error(ctx, { // 响应错误
        status: 400,
        message: '未指定id或id格式错误',
        result: '',
      });
    }
    const { name, email, password, role_id } = ctx.request.body;
    // 如果字段存在但格式不合法则返回 true
    let check = (name && !nameRegExp.test(name)) ||
      (email && !emailRegExp.test(email)) ||
      (password && !passwordRegExp.test(password)) ||
      (role_id && !idRegExp.test(role_id));
    // 如果 check 为 true，返回错误
    if (check) {
      return response.error(ctx, { // 响应错误
        status: 400,
        message: '修改信息格式错误',
        result: '',
      });
    }
    // 检查邮箱是否已被注册
    const adminInfo = await adminService.getOneByEmail(email);
    if (adminInfo && adminInfo.id != id) {
      return response.error(ctx, {
        status: 409,
        message: '邮箱已被注册',
        result: { email },
      });
    };
    await next();
  },


  /**
   * 检查查询参数是否合法
   */
  async checkFilterParams(ctx, next) {
    const { name, email, role_id, page, pageSize } = ctx.request.query;
    // 如果字段存在但格式不合法则返回 true，page、pageSize 不存在或者格式不合法时也返回 true
    let check = (name && !nameRegExp.test(name)) ||
    (email && !emailRegExp.test(email)) ||
    (role_id && !idRegExp.test(role_id)) ||
    (!page || !idRegExp.test(page)) ||
    (!pageSize || !idRegExp.test(pageSize));
    // 如果 check 为 true，返回错误
    if (check) {
      return response.error(ctx, {
        status: 400,
        message: '查询参数格式错误',
        result: '',
      });
    }
    await next();
  },


  /**
   * 根据 email 检测管理员是否已存在
   */
  async checkAdminExists(ctx, next) {
    // 请求方法为 GET 时，从 ctx.request.query 中获取 email，否则从 ctx.request.body 获取。
    const { email } = ctx.method === 'GET' ? ctx.request.query : ctx.request.body;
    if (!email) {
      return response.error(ctx, {
        status: 400,
        message: '未收到email参数',
        result: ''
      });
    }
    if (!emailRegExp.test(email)) {
      return response.error(ctx, {
        status: 400,
        message: '邮箱格式不正确',
        result: { email },
      });
    }
    const adminInfo = await adminService.getOneByEmail(email);
    if (!adminInfo) {
      return response.error(ctx, {
        status: 404,
        message: '该邮箱未注册',
        result: { email },
      });
    }
    // 将信息保存至 ctx.state
    ctx.state = adminInfo;
    await next();
  },


  /**
   * 加密密码
   */
  async cryptPassword(ctx, next) {
    const { password } = ctx.request.body;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      ctx.request.body.password = hash;
    }
    await next();
  },


  /**
   * 检查密码登录
   */
  async checkPwdLogin(ctx, next) {
    const { email, password } = ctx.request.body;
    if (!email || !password || !emailRegExp.test(email) || !passwordRegExp.test(password)) {
      return response.error(ctx, {
        status: 400,
        message: '邮箱或密码格式错误',
        result: ''
      });
    }
    const adminInfo = await adminService.getOneByEmail(email);
    if (!adminInfo) {
      return response.error(ctx, {
        status: 404,
        message: '该邮箱未注册',
        result: { email },
      });
    }
    // 使用 bcrypt 验证密码
    if (!bcrypt.compareSync(password, adminInfo.password)) {
      logError('邮箱或密码错误', {email});
      return response.error(ctx, {
        status: 400,
        message: '邮箱或密码错误',
        result: ''
      });
    }

    await next();
  },


  /**
   * 检查邮箱验证码登录参数是否合法
   */
  async checkEmailCodeLoginParams(ctx, next) {
    const { email, verify_code } = ctx.request.body;
    if (!email || !verify_code || !emailRegExp.test(email) || !verifyCodeRegexp.test(verify_code)) {
      return response.error(ctx, {
        status: 400,
        message: '邮箱或验证码格式错误',
        result: ''
      });
    }
    const adminInfo = await adminService.getOneByEmail(email);
    if (!adminInfo) {
      return response.error(ctx, {
        status: 404,
        message: '该邮箱未注册',
        result: { email },
      });
    }

    ctx.state = { email, verify_code };
    await next();
  },


  /**
   * 检查修改密码的参数是否正确
   */
  async checkModifyPwdParams(ctx, next) {
    const { password, verify_code } = ctx.request.body;
    if (!password || !verify_code || !passwordRegExp.test(password) || !verifyCodeRegexp.test(verify_code)) {
      return response.error(ctx, {
        status: 400,
        message: '密码或验证码格式错误',
        result: ''
      });
    }
    ctx.state.verify_code = verify_code;
    await next();
  }

}