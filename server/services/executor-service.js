const ApiError = require("../errors/api-error");
const { Order, User, Executor, Role, UserRole } = require("../models/models");
const config = require("../config");
const roles = require("./role-service");

class ExecutorService {
    // TODO (try / catch protection)
    async createExecutor(userId) {
        const user = await User.findByPk(userId);
        const executor = await Executor.create({});
        await user.setExecutor(executor);
        await roles.addUserRole(user, config.ROLES.executor.title);
    }
}
module.exports = new ExecutorService();
