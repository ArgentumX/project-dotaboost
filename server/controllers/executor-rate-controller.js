const ApiError = require("../errors/api-error");
const rateService = require("../services/rate-service");
const { validationResult } = require("express-validator");

class ExecutorRateController {
    async addRate(req, res, next) {
        try {
            const { executorId, isLike } = req.body;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const rate = await rateService.addExecutorRate(userId, executorId, isLike);
            return res.json(rate);
        } catch (e) {
            next(e);
        }
    }
    async removeRate(req, res, next) {
        try {
            const { executorId } = req.body;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const result = await rateService.removeExecutorRate(userId, executorId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async getRates(req, res, next) {
        try {
            const { userId, executorId } = req.body;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const ratesData = await rateService.getExecutorRates(userId, executorId);
            return res.json(ratesData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ExecutorRateController();
