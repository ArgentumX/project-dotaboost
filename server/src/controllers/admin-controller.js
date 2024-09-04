const { validationResult } = require("express-validator");
const ApiError = require("../errors/api-error");
const executorTicketService = require("../services/executor-ticket-service");
const orderService = require("../services/order-service");

class AdminController {
    async verifyExecutorInfo(req, res, next) {
        try {
            const { ticketId, success } = req.body;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            let ticketData;
            if (success) {
                ticketData = await executorTicketService.acceptVerification(ticketId);
            } else {
                ticketData = await executorTicketService.rejectVerification(ticketId);
            }
            return res.json(ticketData);
        } catch (e) {
            next(e);
        }
    }
    async getExecutorTicket(req, res, next) {
        try {
            const { id } = req.params;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const ticketData = await executorTicketService.getTicket(id);
            return res.json(ticketData);
        } catch (e) {
            next(e);
        }
    }

    async getExecutorTickets(req, res, next) {
        try {
            const options = req.query;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const ticketData = await executorTicketService.getTickets(options);
            return res.json(ticketData);
        } catch (e) {
            next(e);
        }
    }

    async removeOrder(req, res, next) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const result = await orderService.removeOrder(userId, orderId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async closeOrder(req, res, next) {
        try {
            const { orderId } = req.params;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const result = await orderService.closeOrderById(orderId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AdminController();
