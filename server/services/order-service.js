const ApiError = require("../errors/api-error");
const { Order, User, Executor, Role, UserRole } = require("../models/models");
const config = require("../config");
const jwt = require("jsonwebtoken");
const OrderDto = require("../dtos/order-dto");

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

    async getOrders(creatorId) {
        let orders;
        if (!creatorId) {
            orders = await Order.findAll();
        }
        if (creatorId) {
            orders = await Order.findAll({ where: { userId: creatorId } });
        }
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
        } = orderSettings;

        const user = await User.findByPk(userId);
        if (!user) {
            return next(ApiError.BadRequest("user not found"));
        }

        const hasNoPaidOrder = await Order.findOne({
            where: { paid: false, userId },
        });
        if (hasNoPaidOrder) {
            throw new ApiError.BadRequest("unable to create new orders before other not paided");
        }

        const order = await Order.create({
            party,
            priority,
            steamGuard,
            playTime,
            steamUsername,
            steamPassword,
        });
        await order.setUser(user);
        const orderData = new OrderDto(order);
        orderData.steamUsername = steamUsername;
        orderData.steamPassword = steamPassword;
        return { order: orderData };
    }
}

module.exports = new OrderService();
