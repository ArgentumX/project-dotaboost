const ApiError = require("../errors/api-error");
const { Order, User, Executor, Role, UserRole } = require("../models/models");
const config = require("../config");
const roles = require("./role-service");
const ExecutorDto = require("../dtos/executor-dto");

class ExecutorService {
    async createExecutor(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const executor = await Executor.create({});
        await user.setExecutor(executor);
        await roles.addUserRole(user, config.ROLES.executor.title);
        const executorData = new ExecutorDto(executor);
        return { executor: executorData };
    }
}
module.exports = new ExecutorService();
