const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Admin = sequelize.define('zzb_admin', {
  admin_name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户名, 必填'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '邮箱, 必填, 唯一'
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码, 必填'
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '角色, 关联管理员角色表id'
  }
});

// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// Admin.sync();

// 将创建表,如果表已经存在,则将其首先删除
// Admin.sync({ force: true });

// 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
// Admin.sync({ alter: true });

module.exports = Admin;