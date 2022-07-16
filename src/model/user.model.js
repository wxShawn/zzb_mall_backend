const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const User = sequelize.define('zzb_user', {
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名, 必填, 唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码, 必填'
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员, 0: 不是(默认); 1: 是'
  }
});

// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// User.sync();

// 将创建表,如果表已经存在,则将其首先删除
// User.sync({ force: true });

// 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
// User.sync({ alter: true });

module.exports = User;