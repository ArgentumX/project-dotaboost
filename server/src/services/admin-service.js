const ApiError = require("../errors/api-error");
const config = require("../config");
const roleService = require("./role-service");
const userService = require("./user-service");
const executorService = require("./executor-service");
const ipBlacklistMiddleware = require("../middleware/ip-blacklist-middleware");
const commentService = require("./comment-service");
class AdminService {
    async handleBanRequest(userId) {
        const userModel = await userService.getUserModel(userId);
        await roleService.addUserRole(userModel, config.ROLES.LIST.banned.title);
        const lastIp = await userService.getLastIp(userId);
        if (lastIp) {
            ipBlacklistMiddleware.addBlacklistIp(lastIp);
        }
        return { message: "success" };
    }
    async handlePostBanRequest(userId) {
        const userModel = await userService.getUserModel(userId);
        await commentService.removeUserComments(userId);
        return await roleService.addUserRole(userModel, config.ROLES.LIST.post_ban.title);
    }
    async handleCreateExecutorRequest(userId) {
        return await executorService.createExecutor(userId);
    }
    async handleGetUserRequest(userId) {
        return await userService.getUser(userId, true, false);
    }

    async handleUnbanRequest(userId) {
        const userModel = await userService.getUserModel(userId);
        await roleService.removeUserRole(userModel, config.ROLES.LIST.banned.title);
        const lastIp = await userService.getLastIp(userId);
        if (lastIp) {
            ipBlacklistMiddleware.removeBlacklistIp(lastIp);
        }
        return { message: "success" };
    }

    async handlePostUnbanRequest(userId) {
        const userModel = await userService.getUserModel(userId);
        return await roleService.removeUserRole(userModel, config.ROLES.LIST.post_ban.title);
    }
}

module.exports = new AdminService();
