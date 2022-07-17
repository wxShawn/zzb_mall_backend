const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const VerifyCode = sequelize.define('zzb_verify_code', {
  verify_code: {
    type: DataTypes.CHAR(6),
    allowNull: false,
    comment: '验证码，必填'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '邮箱, 必填, 唯一'
  },
  used_for: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '验证码用途'
  }
});

// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// VerifyCode.sync();

// 将创建表,如果表已经存在,则将其首先删除
// User.sync({ force: true });

// 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
// User.sync({ alter: true });

module.exports = VerifyCode;