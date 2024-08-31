const ApiError = require("../errors/api-error");
const config = require("../config");
const roleService = require("./role-service");

class AdminService {
    async isAdmin(userId) {
        return await roleService.hasRole(userId, config.ROLES.LIST.admin.title);
    }
}

module.exports = new AdminService();
