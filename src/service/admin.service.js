const { logError } = require('../logger/logger');
const Admin = require('../model/admin.model');

class AdminService {

  /**
   * 创建管理员
   * @param {string} admin_name 管理员名称
   * @param {string} email      邮箱
   * @param {string} password   密码
   * @param {number} role_id    角色（非必填）
   * @returns {
   *   sucsses: boolean,
   *   data: Object,
   * }
   * 返回值说明：
   *    sucsses：创建成功时为 ture，创建失败为 false
   *    data：创建成功时为创建的数据对象，创建失败时为错误信息
   */
  async create({ admin_name, email, password, role_id }) {
    let res = {};
    try {
      res = await Admin.create({ admin_name, email, password, role_id });
    } catch (error) {
      logError('admin创建失败', error);
      return { sucsses: false, data: error };
    }
    // 返回创建成功的用户信息
    return { sucsses: true , data: res.dataValues };
  }



  /**
   * 查询第一个符合条件的管理员, 至少需要传一个参数
   * @param {number} id         管理员id（非必填）
   * @param {string} email      邮箱（非必填）
   * @returns {
   *   sucsses: boolean,
   *   data: Object
   * }
   * 返回值说明：
   *    sucsses：查询成功时为 ture，查询失败为 false
   *    data：查询成功时为查询到的数据对象或 null，查询失败时为错误信息
   */
  async getOne({id, email}) {
    // 将存在的参数添加到 option 中
    const option = {};
    id && Object.assign(option, { id });
    email && Object.assign(option, { email });

    // 如果 option === {}，说明函数没有传入有效的参数
    if (Object.keys(option).length === 0) {
      logError('AdminService.getOne未接收有效的参数');
      return { sucsses: false, data: 'AdminService.getOne未接收有效的参数' };
    }

    // 在数据表中查询符合 option 条件的第一条数据
    let res = {};
    try {
      res = await Admin.findOne({
        attributes: ['id', 'admin_name', 'email', 'password', 'role_id'],
        where: option,
      });
    } catch (error) {
      logError('admin查询失败');
      return { sucsses: false, data: error }
    }
    if (!res) {
      return { sucsses: true, data: null };
    } else {
      return { sucsses: true, data: res.dataValues };
    }
  }



  async getAll() {

  }



  /**
   * 根据 id 更新管理员信息
   * @param {number} id          // 管理员id
   * @param {string} admin_name  // 管理员名称（非必填）
   * @param {string} password    // 密码（非必填）
   * @param {number} role_id     // 管理员角色id（非必填）
   */
  async updateById(id, { admin_name, password, role_id }) {
    // 将存在的参数添加到 option 中
    const option = {};
    admin_name && Object.assign(option, { admin_name });
    password && Object.assign(option, { password });
    role_id && Object.assign(option, { role_id });

    // 如果 id 不存在，或 option === {}，说明函数没有传入有效的参数
    if (!id || Object.keys(option).length === 0) {
      logError('AdminService.updateById 未接收到有效参数');
      return { sucsses: false, data:'AdminService.updateById 未接收到有效参数' };
    }
    // 更新
    let res = {};
    try {
      res = await Admin.update(option, { where: { id } });
    } catch (error) {
      logError('admin更新失败', error);
      return { sucsses: false, data: error };
    }
    return { sucsses: true, data: res };
  }

}

module.exports = new AdminService();