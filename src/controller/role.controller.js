const response = require('../app/response');
const roleService = require('../service/role.service')

class RoleController {
  async getRoleList(ctx, next) {
    const roleList = await roleService.getAll();
    response.success(ctx, {
      status: 200,
      message: '角色列表获取成功',
      result: roleList,
    })
  }
}

module.exports = new RoleController();