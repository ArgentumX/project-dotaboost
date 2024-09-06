const ApiError = require("../errors/api-error");
const config = require("../config");
const roleService = require("./role-service");
const userService = require("./user-service");
const executorService = require("./executor-service");

class AdminService {
    async handleBanUserRequest(userId) {
        const userModel = await userService.getUserModel(userId);
        return await roleService.addUserRole(userModel, config.ROLES.LIST.banned.title);
    }
    async handlePostBanUserRequest(userId) {
        const userModel = await userService.getUserModel(userId);
        return await roleService.addUserRole(userModel, config.ROLES.LIST.post_ban.title);
    }

    async handleCreateExecutorRequest(userId) {
        return await executorService.createExecutor(userId);
    }

    async isAdmin(userId) {
        return await roleService.hasRole(userId, config.ROLES.LIST.admin.title);
    }
}

module.exports = new AdminService();
