const ApiError = require("../errors/api-error");
const batchServices = require("../services/batch-services");
const executorService = require("../services/executor-service");
const orderService = require("../services/order-service");
const { validationResult } = require("express-validator");

class OrderController {
    async createOrder(req, res, next) {
        try {
            const userData = req.user;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
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
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const orderData = await orderService.getOrder(id);
            return res.json(orderData);
        } catch (e) {
            next(e);
        }
    }

    async getOrders(req, res, next) {
        try {
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const ordersData = await orderService.getOrders(req.query);
            return res.json(ordersData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new OrderController();
