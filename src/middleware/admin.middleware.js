const { logError } = require('../logger/logger');
const { nameRegExp, emailRegExp, passwordRegExp, idRegExp } = require('../utils/RegExp');
const response = require('../app/response');
const bcrypt = require('bcryptjs');
const adminService = require('../service/admin.service');

module.exports = {

  // 检查管理员注册信息是否合法
  async checkAdminRegisterInfo(ctx, next) {
    const { admin_name, email, password, role_id } = ctx.request.body;
    //创建一个对象数组，将注册信息中合法的部分替换为空字符串，然后将返回的新字符串赋值给属性 str。
    let checkList = [
      { str: admin_name.replace(nameRegExp, ''), errorMsg: '管理员名称格式错误' },
      { str: email.replace(emailRegExp, ''), errorMsg: '邮箱格式错误' },
      { str: password.replace(passwordRegExp, ''), errorMsg: '密码格式错误' },
      { str: role_id.replace(idRegExp, ''), errorMsg: '角色id格式错误' },
    ];
    let errorList = [];
    // 遍历 checkList，如果 str 的长度大于0，则说明其含有不合法的内容，将对应的错误消息添加到 errorList 中。
    for (const item of checkList) {
      if (item.str.length > 0) errorList.push(item.errorMsg);
    }
    // errorList 长度大于0，返回错误
    if (errorList.length > 0) {
      logError(errorList); // 记录日志并打印错误
      return response.error(ctx, { // 响应错误
        status: 400,
        message: '注册信息格式错误',
        result: { errorList },
      });
    }

    await next();
  },


  // 根据 email 检测管理员是否已存在
  async checkAdminExists(ctx, next) {
    // 请求方法为 GET 时，从 ctx.request.query 中获取 email，否则从 ctx.request.body 获取。
    const { email } = ctx.method === 'GET' ? ctx.request.query : ctx.request.body;
    if (!email) {
      response.error(ctx, {
        status: 400,
        message: '未接收到 email',
        result: ''
      });
    }

    const getAdmin = await adminService.getOne({ email });
    if (!getAdmin.sucsses) {
      return response.error(ctx, {
        status: 500,
        message: '服务器错误',
        result: ''
      });
    }
    const adminInfo = getAdmin.data;
    
    // 当请求 url 为 register 时且 adminInfo 存在，返回错误“管理员已存在”
    // 当请求 url 为 login 时且 adminInfo 不存在，返回错误“管理员不存在”
    const url = ctx.request.url;
    if (url.includes('/admin/register') && adminInfo) {
      logError(email, '管理员已存在');
      return response.error(ctx, {
        status: 409,
        message: '管理员已存在',
        result: { email }
      });
    } else if (url.includes('/admin/login') && !adminInfo) {
      logError(email, '管理员不存在');
      return response.error(ctx, {
        status: 400,
        message: '管理员不存在',
        result: { email }
      });
    }

    // 当请求 url 为 login 时（登录相关），将 adminInfo 保存至 ctx.request.body，避免后续额外的查询数据库操作
    if (url.includes('/admin/login')) {
      ctx.state.adminInfo = adminInfo;
    }

    await next();
  },


  // 加密密码
  async cryptPassword(ctx, next) {
    const { password } = ctx.request.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    ctx.request.body.password = hash;

    await next();
  },


  // 检测密码是否正确
  async checkPassword(ctx, next) {
    const { email, password } = ctx.request.body;
    const getAdmin = await adminService.getOne({ email });
    if (!getAdmin.sucsses) {
      return response.error(ctx, {
        status: 500,
        message: '服务器错误',
        result: ''
      });
    }
    const adminInfo = getAdmin.data;
    // 使用 bcrypt 验证密码
    if (!bcrypt.compareSync(password, adminInfo.password)) {
      logError('密码错误', {email});
      return response.error(ctx, {
        status: 400,
        message: '密码错误',
        result: ''
      });
    }

    await next();
  }

}