const { userRegisterError, getVerifyCodeError } = require('../constant/error.type');
const { createUser, getUserInfo } = require('../service/user.service');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

class UserController {
  // 给用户发送注册验证码
  async sendRegisterCode(ctx, next) {
    const { email } = ctx.request.body

    // 生成6位随机验证码
    let verifyCode = '';
    while (verifyCode.length < 6) {
      verifyCode = (Math.random() * 1000000 + '').slice(0, 6);
    }
    
    // 加密验证码
    const salt = bcrypt.genSaltSync(10);
    const verifyCodeCrypted = bcrypt.hashSync(verifyCode, salt);

    // 设置验证码过期时间(单位：min)
    const expire = 5;

    // 配置邮件内容
    const option = {
      to: email,
      subject: '【ZZB商城】注册邮箱验证',
      html: ` <div style="padding: 10px 20px; background: #fcfcff; font-size: 14px;">
                <p>你好！</p>
                <p>
                  <span>感谢你注册ZZB商城。</span><br/>
                  <span>你的登录邮箱为：${email}，请回填如下验证码：</span>
                </p>
                <p
                  style="font-size: 26px;
                  font-weight: bold;
                  color: #025bc0;
                  width: 160px;
                  background: #f2f4f7;
                  text-align: center;
                  letter-spacing: 3px;"
                  >
                  ${verifyCode}
                </p>
                <p>验证码在${expire}分钟内有效，请及时使用。</p>
                <p style="color: #f00;">注：如非本人操作请忽略此邮件！</p>
              </div>`
    }

    let res = {}
    // 给用户发送邮件
    try {
      res = await sendEmail(option);
    } catch (error) {// 捕获到错误，提交错误
      console.error(error);
      ctx.app.emit('error', getVerifyCodeError, ctx);
      return false;
    }

    // 设置加密验证码
    ctx.cookies.set('verifyCode', verifyCodeCrypted, { maxAge: 1000*60*expire });
    // 响应客户端
    ctx.body = {
      code: 0,
      message: '验证码已发送',
      result: '',
    };
    
  }

  // 用户注册
  async register(ctx, next) {
    const { user_name, email, password } = ctx.request.body;
    
    let userInfo = {}
    // 创建用户
    try {
      userInfo = await createUser(user_name, email, password);
    } catch (error) {// 捕获到错误，提交错误
      console.error(error);
      ctx.app.emit('error', userRegisterError, ctx);
      return false;
    }
    
    // 响应客户端
    ctx.body = {
      code: 0,
      message: '注册成功',
      result: {
        id: userInfo.id,
        email: userInfo.email,
        user_name: userInfo.user_name,
      }
    }
  }

  // 用户登录
  async login(ctx, next) {
    const { email, password } = ctx.request.body;
    const userInfo = await getUserInfo({ email });
    if (userInfo) {
      if (bcrypt.compareSync(password, userInfo.password)) {
        ctx.body = {
          code: 0,
          message: '登录成功',
          result: {
            id: userInfo.id,
            email: userInfo.email,
            user_name: userInfo.user_name,
          }
        }
      }
    }
  }
}

module.exports = new UserController();