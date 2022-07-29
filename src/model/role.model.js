const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Admin = require('./admin.model');

const Role = sequelize.define('zzb_role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '角色名, 必填'
  },
});

// 关联 Admin，一个 Role 拥有多个 Admin
Role.hasMany(Admin, { foreignKey: 'role_id' });
Admin.belongsTo(Role, { foreignKey: 'role_id' });

// 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
// Role.sync();

// 将创建表,如果表已经存在,则将其首先删除
// Role.sync({ force: true });
// Admin.sync({ force: true });

// 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
// Role.sync({ alter: true });
// Admin.sync({ alter: true });

module.exports = Role;