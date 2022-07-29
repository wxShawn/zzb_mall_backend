const Role = require('../model/role.model');

class RoleService {
  async getAll() {
    return await Role.findAll();
  }
}

module.exports = new RoleService();