const ApiError = require("../errors/api-error");
const { Order, Executor } = require("../models/models");
const { User } = require("../models/user-model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const OrderDto = require("../dtos/order-dto");
const { createFilter } = require("../utils/db-utils");
const priceCalculator = require("../../global/prices/price-calculator");
const userService = require("./user-service");
const { Model } = require("sequelize");
const executorService = require("./executor-service");

class OrderService {
    async getOrder(orderId, hideSecretData = true) {
        const order = await this.getOrderModel(orderId);
        const orderData = new OrderDto(order, hideSecretData);
        return { order: orderData };
    }
    async getOrderModel(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw ApiError.BadRequest("Order not found");
        }
        return order;
    }

    async getOrders(options) {
        const orders = await Order.findAll({
            limit: config.DB_ORDER_SEARCH_LIMIT,
            offset: options.offset,
            where: createFilter(options, config.ALLOWED_ORDER_FILTERS),
        });
        const ordersData = orders.map((order) => new OrderDto(order));
        return { orders: ordersData };
    }

    async createOrder(userId, orderSettings) {
        const {
            party = false,
            priority = false,
            steamGuard = false,
            playTime = { NIGHT: true, MORNING: true, AFTERNOON: true, EVENING: true },
            steamUsername,
            steamPassword,
            startRating,
            endRating,
        } = orderSettings;

        const user = await User.findByPk(userId);
        if (!user) {
            return next(ApiError.BadRequest("user not found"));
        }

        if (userService.isExecutor(userId)) {
            throw ApiError.BadRequest("Executor cant create orders");
        }

        const hasNoPaidOrder = await Order.findOne({
            where: { paid: false, userId },
        });
        if (hasNoPaidOrder) {
            throw ApiError.BadRequest("unable to create new orders before other not payed");
        }

        const order = await Order.create({
            party,
            priority,
            steamGuard,
            playTime,
            steamUsername,
            steamPassword,
            startRating,
            currentRating: startRating,
            endRating,
        });
        await order.setUser(user);
        const orderData = new OrderDto(order, false);
        return { order: orderData };
    }

    async isOrderBelongsToExecutor(orderId, executorId) {
        const executorModel = await this.getOrderExecutorModel(orderId);
        return executorModel.id === executorId;
    }

    async isOrderTaken(orderId) {
        try {
            const executorModel = await this.getOrderExecutorModel(orderId);
            return executorModel != null;
        } catch (e) {
            return false;
        }
    }

    async getOrderExecutorModel(orderId) {
        const executor = await Executor.findOne({ where: { orderId } });
        if (!executor) {
            throw ApiError.BadRequest("Executor of this order not found");
        }
        return executor;
    }
    async closeOrder(orderModel) {
        orderModel.closed = true;
        await orderModel.save();
        const executorModel = await this.getOrderExecutorModel(orderModel.id);
        await executorService.refuseOrder(executorModel.userId);
        return { message: "success" };
    }
    async addRatingPoints(orderModel, points) {
        orderModel.currentRating += points;
        await orderModel.save();
        if (orderModel.endRating <= orderModel.currentRating) {
            this.closeOrder(orderModel);
        }
        return { message: "success" };
    }
}

module.exports = new OrderService();
