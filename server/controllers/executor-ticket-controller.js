const ApiError = require("../errors/api-error");
const { VerifyExecutorTicket, User } = require("../models/models");
const executors = require("../services/executor-service");
const config = require("../config");
const files = require("../utils/file-utils");
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
                return next(ApiError.ValidationError());
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
}

module.exports = new ExecutorTicketController();
