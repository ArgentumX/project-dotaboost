const ApiError = require("../errors/api-error");
const batchServices = require("../services/batch-services");
const executorService = require("../services/executor-service");
const { validationResult } = require("express-validator");

class BatchController {
    async createBatch(req, res, next) {
        try {
            const { isWin, receivedMMR, orderId } = req.body;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const executorId = await executorService.getExecutorByUserId(userId).id;
            const batch = await batchServices.createBatch(executorId, orderId, receivedMMR, isWin);
            return res.json(batch);
        } catch (e) {
            next(e);
        }
    }
    async loadScreen(req, res, next) {
        try {
            const image = req.files.image;
            const { batchId } = req.body;
            const userData = req.user;
            const executorId = await executorService.getExecutorByUserId(userData.id).id;
            const result = await batchServices.loadScreen(executorId, batchId, image);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async getBatch(req, res, next) {
        try {
            const { id } = req.params;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const batch = await batchServices.getBatch(id);
            return res.json(batch);
        } catch (e) {
            next(e);
        }
    }
    async getBatches(req, res, next) {
        try {
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const batches = await batchServices.getBatches(req.query);
            return res.json(batches);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new BatchController();
