const ApiError = require("../errors/api-error");
const config = require("../config");
const roleService = require("./role-service");
const userService = require("./user-service");

class AdminService {
    async handleAddUserRoleRequest(userId, roleTittle) {
        const userModel = await userService.getUserModel(userId);
        return await roleService.addUserRole(userModel, roleTittle);
    }
    async isAdmin(userId) {
        return await roleService.hasRole(userId, config.ROLES.LIST.admin.title);
    }
}

module.exports = new AdminService();
