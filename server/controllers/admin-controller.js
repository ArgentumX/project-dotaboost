const { validationResult } = require("express-validator");
const ApiError = require("../errors/api-error");
const { VerifyExecutorTicket } = require("../models/models");
const executorTicketService = require("../services/executor-ticket-service");

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
}

module.exports = new AdminController();
