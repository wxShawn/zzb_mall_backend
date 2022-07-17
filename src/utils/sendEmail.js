const nodemailer = require('nodemailer');
const { SERVICE_EMAIL, EMAIL_PASS }  = require('../config/config.default');

//创建一个SMTP客户端配置对象
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: SERVICE_EMAIL,  // 邮箱
    pass: EMAIL_PASS   // 邮箱授权码
  }
});

// 配置邮件的固定内容
const option = {
  from: SERVICE_EMAIL,
}


module.exports = (otherOpt) => {
  const opt = {...option, ...otherOpt};
  return new Promise((resolve, reject) => {
    // 发送邮件
    transporter.sendMail(opt, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    })
  })
};