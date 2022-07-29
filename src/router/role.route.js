const Router = require('koa-router');
const { getRoleList } = require('../controller/role.controller');


const roleRouter = new Router({prefix: '/roles'});

roleRouter.get('/', getRoleList);

module.exports = roleRouter;