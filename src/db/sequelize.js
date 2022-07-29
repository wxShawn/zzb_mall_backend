const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_DB, MYSQL_USER, MYSQL_PWD } = require('../config/config.default');

// 使用sequelize连接数据库
const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql',
  timezone: '+08:00', // 设置sequelize时区（仅对写入时有效，读取时sequelize依然会自动转化成 UTC +00:00）
  // dialectOptions: {
  //   typeCast (field, next) {
  //     // 重新返回 date，避免 sequelize 在读取 date 时将其自动转化为 UTC +00:00
  //     if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
  //       return new Date(field.string() + 'Z');
  //     }
  //     return next();
  //   }
  // },
});

// 检测连接状态
// sequelize.authenticate().then(() => {
//   console.log('数据库连接成功');
// }).catch(error => {
//   console.log('数据库连接失败', error);
// });

module.exports = sequelize;