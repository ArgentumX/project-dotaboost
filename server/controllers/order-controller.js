const ApiError = require("../errors/api-error");
const { Order, User } = require("../models/models");
const orderService = require("../services/order-service");
const { validationResult } = require("express-validator");

class OrderController {
    async createOrder(req, res, next) {
        try {
            const userData = req.user;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError());
            }
            const orderData = await orderService.createOrder(userData.id, req.body);
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async getOrder(req, res, next) {
        try {
            const { id } = req.params;
            console.log(1);
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.BadRequest("wrong input format"));
            }
            const orderData = await orderService.getOrder(id);
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async getOrders(req, res, next) {
        try {
            const { creatorId } = req.query;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.BadRequest("wrong input format"));
            }
            const ordersData = await orderService.getOrders(creatorId);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrderController();
