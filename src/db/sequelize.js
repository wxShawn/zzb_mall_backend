const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_DB, MYSQL_USER, MYSQL_PWD } = require('../config/config.default');

// 使用sequelize连接数据库
const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql',
});

// 检测连接状态
// sequelize.authenticate().then(() => {
//   console.log('数据库连接成功');
// }).catch(error => {
//   console.log('数据库连接失败', error);
// });

module.exports = sequelize;