const ApiError = require("../errors/api-error");
const { Executor, Order } = require("../models/models");
const { User } = require("../models/user-model");
const config = require("../config");
const roleService = require("./role-service");
const ExecutorDto = require("../dtos/executor-dto");
const OrderDto = require("../dtos/order-dto");
const userService = require("./user-service");

class ExecutorService {
    async createExecutor(userId) {
        const user = await userService.getUserModel(userId);
        if (await userService.isExecutor(userId)) {
            throw ApiError.BadRequest("user is already executor");
        }
        const executor = await Executor.create({});
        await user.setExecutor(executor);
        await roleService.addUserRole(user, config.ROLES.LIST.executor.title);
        const executorData = new ExecutorDto(executor);
        return { executor: executorData };
    }
    async getExecutorModelByUserId(userId) {
        const executor = await Executor.findOne({ where: { userId } });
        if (!executor) {
            throw ApiError.BadRequest("executor not found");
        }
        return executor;
    }

    async getExecutorByUserId(userId, loadUserData = false) {
        let result = {};
        const executor = await this.getExecutorModelByUserId(userId);
        if (loadUserData) {
            const { user } = await userService.getUser(userId, true);
            result.user = user;
        }
        result.executor = new ExecutorDto(executor);
        return result;
    }
}
module.exports = new ExecutorService();
