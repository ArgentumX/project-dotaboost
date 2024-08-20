const ApiError = require("../errors/api-error");
const executors = require("../services/executor-service");
const config = require("../config");
const testService = require("../services/test-service");
const executorTicketService = require("../services/executor-ticket-service");
const { validationResult } = require("express-validator");

class ExecutorTicketController {
    async createTicket(req, res, next) {
        try {
            const { answers } = req.body;
            const userData = req.user;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            if (!testService.isTestPassed(answers)) {
                return next(ApiError.BadRequest("test not passed"));
            }
            const ticketData = await executorTicketService.createTicket(userData.id);
            return res.json(ticketData);
        } catch (e) {
            next(e);
        }
    }
    async uploadScreen(req, res, next) {
        try {
            const image = req.files.image;
            const userData = req.user;
            const screen = await executorTicketService.uploadScreen(userData.id, image);
            return res.json(screen);
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
            if (ticketData.ticket.userId !== req.user.id) {
                throw next(ApiError.NoPermissions());
            }
            return res.json(ticketData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ExecutorTicketController();
