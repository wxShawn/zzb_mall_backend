const User = require('../model/user.model'); 

class UserService {
  // 创建用户
  async createUser(user_name, email, password) {
    // User.create({
    //   user_name: user_name,
    //   password: password,
    //   isAdmin: 0,
    // });
    const res = await User.create({ user_name, email, password });
    // 返回创建成功的用户信息
    return res.dataValues;
  }

  // 查询满足条件的用户, 接收一个包含若干属性的对象参数
  async getUserInfo({id, user_name, email, password, is_admin}) {
    // 将所有参数的所有属性和属性值保存到 option 对象中
    const option = {};
    id && Object.assign(option, { id });
    user_name && Object.assign(option, { user_name });
    email && Object.assign(option, { email });
    password && Object.assign(option, { password });
    is_admin && Object.assign(option, { is_admin });
    
    // 如果 option === {}，说明函数没有传入有效的参数
    if (Object.keys(option).length === 0) {
      return 'getUserInfo 函数接受的参数无效';
    }

    // 在数据表中查询符合 option 条件的第一条数据
    const res = await User.findOne({
      attributes: ['id', 'user_name', 'email', 'password', 'is_admin'],
      where: option,
    });
    return res ? res.dataValues : null;
  }
}

module.exports = new UserService();