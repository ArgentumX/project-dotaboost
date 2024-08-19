const ApiError = require("../errors/api-error");
const { Executor } = require("../models/models");
const { User } = require("../models/user-model");
const config = require("../config");
const roleService = require("./role-service");
const ExecutorDto = require("../dtos/executor-dto");

class ExecutorService {
    async createExecutor(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const executor = await Executor.create({});
        await user.setExecutor(executor);
        await roleService.addUserRole(user, config.ROLES.LIST.executor.title);
        const executorData = new ExecutorDto(executor);
        return { executor: executorData };
    }
}
module.exports = new ExecutorService();
