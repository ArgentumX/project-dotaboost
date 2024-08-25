const ApiError = require("../errors/api-error");
const { Order, Executor } = require("../models/models");
const { User } = require("../models/user-model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const OrderDto = require("../dtos/order-dto");
const { createFilter } = require("../utils/db-utils");

class OrderService {
    async getOrder(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw ApiError.BadRequest("Order not found");
        }
        const orderData = new OrderDto(order);
        return { order: orderData };
    }

    // spited with getOrder for more security
    async getSteamAccountInfo(orderId) {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw ApiError.BadRequest("Order not found");
        }
        return { username: order.steamUsername, password: order.steamPassword };
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
            endRating,
        });
        await order.setUser(user);
        const orderData = new OrderDto(order, false);
        return { order: orderData };
    }

    async isOrderBelongsToExecutor(orderId, executorId) {
        const order = await Executor.findOne({ where: { id: executorId, orderId } });
        return order != null;
    }
}

module.exports = new OrderService();
