const ApiError = require("../errors/api-error");
const { Executor, Order } = require("../models/models");
const { User } = require("../models/user-model");
const config = require("../config");
const roleService = require("./role-service");
const ExecutorDto = require("../dtos/executor-dto");
const OrderDto = require("../dtos/order-dto");

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
    async getExecutorId(userId) {
        const executor = await Executor.findOne({ where: userId });
        if (!executor) {
            throw ApiError.BadRequest("executor not found");
        }
        return executor.id;
    }

    async takeOrder(userId, orderId) {
        const executor = await Executor.findOne({ where: { userId } });
        if (!executor) {
            throw ApiError.BadRequest("executor not found");
        }
        if (executor.orderId) {
            throw ApiError.BadRequest("cant take more than one order simultaneously");
        }
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw ApiError.BadRequest("order not found");
        }
        await order.setExecutor(executor);
        const orderData = new OrderDto(order, false);
        return { order: orderData };
    }

    async refuseOrder(userId) {
        const executor = await Executor.findOne({ where: { userId } });
        if (!executor) {
            throw ApiError.BadRequest("executor not found");
        }
        if (!executor.orderId) {
            throw ApiError.BadRequest("executor has not any taken order");
        }
        await executor.setOrder(null);
        return { message: "success" };
    }
}
module.exports = new ExecutorService();
