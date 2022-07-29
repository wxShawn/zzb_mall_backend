const Admin = require('../model/admin.model');
const Role = require('../model/role.model');

class AdminService {

  /**
   * 创建管理员
   * adminInfo {
   *  name, 
   *  email,
   *  password,
   *  role_id
   * }
   */
  async create(adminInfo) {
    const res = await Admin.create(adminInfo);
    // 返回创建成功的用户信息
    return res.dataValues;
  }


  /**
   * 删除管理员
   */
  async remove(id) {
    let res = await Admin.destroy({ where: { id } });
    // 返回删除成功的数量，删除成功时反回 1,未查询到对应 id 的管理员时返回空值
    return res;
  }

  
  /**
   * 修改管理员信息
   * newData {
   *  name, 选填
   *  email,      选填
   *  password,   选填
   *  role_id     选填
   * }
   */
  async update(id, newData) {
    const res = await Admin.update(newData, { where: { id } });
    // 修改成功时反回 1,未查询到对应 id 的管理员时返回空值
    return res[0];
  }


  /**
   * 根据 id 查询管理员信息
   */
  async getOne(id) {
    const res = await Admin.findOne({
      attributes: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt'],
      where: { id },
      include: { model: Role, attributes: ['id', 'name'] } ,
    });
    // 返回查到的数据对象，未查询到时返回空值
    return res ? res.dataValues : null;
  }

  /**
   * 根据 email 查询管理员信息 
   */
  async getOneByEmail(email) {
    const res = await Admin.findOne({
      attributes: ['id', 'name', 'email', 'password', 'role_id'],
      where: { email },
    });
    // 返回查到的数据对象，未查询到时返回空值
    return res ? res.dataValues : null;
  }


  /**
   * 获取所有管理员信息
   * filter {
   *  name,      选填
   *  email,     选填
   *  role_id    选填
   *  page       页码
   *  pageSize   每页数量
   * }
   */
  async getAll(filter) {
    const { page, pageSize, ...otherFilter } = filter;
    const res = await Admin.findAndCountAll({
      where: otherFilter,
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      include: { model: Role, attributes: ['id', 'name'] },
      offset: pageSize * (page - 1),
      limit: pageSize,
    });
    return res;
  }

}

module.exports = new AdminService();