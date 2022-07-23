const { logError } = require('../logger/logger');
const EmailVerify = require('../model/emailVerify.model');

class EmailVerifyService {
  /**
   * 存入验证码
   * @param {string} email 邮箱
   * @param {string} verify_code 验证码
   * @returns {
   *   sucsses: boolean,
   *   data: Object
   * }// 返回一个对象，sucsses：是否删除成功，data：存入成功的数据对象
   * 返回值说明：
   *    sucsses：存入成功时为 ture，存入失败为 false
   *    data：存入成功时为存入的数据对象，存入失败时为错误信息
   */
  async save({ email, verify_code }) {
    let res = {};
    try {
      res = await EmailVerify.create({ email, verify_code });
    } catch (error) {
      logError('验证码保存失败', error);
      return { sucsses: false, data: error };
    }
    return { sucsses: true, data: res.dataValues };
  }

  /**
   * 查询验证码
   * @param {string} email 邮箱
   * @returns {
   *   sucsses: boolean, 
   *   data: Object | null,
   * }
   * 返回值说明：
   *    sucsses：查询成功时为 ture，查询失败为 false
   *    data：查询成功时为查询到的数据对象或 null，查询失败时为错误信息
   */
  async getOne(email) {
    let res = {};
    try {
      res = await EmailVerify.findOne({
        attributes: ['email', 'verify_code'],
        where: { email },
      });
    } catch (error) {
      logError('查询验证码失败', error);
      return { sucsses: false, data: error };
    }
    if (!res) {
      return { sucsses: true, data: null };
    } else {
      return { sucsses: true, data: res.dataValues };
    }
  }

  /**
   * 删除验证码
   * @param {string} email 邮箱
   * @returns {
   *   sucsses: boolean, 
   *   data: Object | number,
   * }
   * 返回值说明：
   *    sucsses：删除成功时为 ture，删除失败为 false
   *    data：删除成功时为删除的数量，删除失败时为错误信息
   */
  async remove(email) {
    let res = {};
    try {
      res = await EmailVerify.destroy({
        where: { email }
      });
    } catch (error) {
      logError('删除验证码失败', error);
      return { sucsses: false, data: error };
    }
    return { sucsses: true, data: res };
  }
}

module.exports = new EmailVerifyService();