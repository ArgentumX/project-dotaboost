const ApiError = require("../errors/api-error");
const config = require("../config");
const { User } = require("../models/user-model");
const { Executor, Order } = require("../models/models");
const { ExecutorComment } = require("../models/comment-model");
const ExecutorCommentDto = require("../dtos/executor-comment-dto");
const { Batch } = require("../models/batch-model");
const orderService = require("./order-service");
const BatchDto = require("../dtos/batch-dto");
const { createFilter } = require("../utils/db-utils");
const fileUtils = require("../utils/file-utils");
const { Op } = require("sequelize");

class BatchService {
    async isExecutorServiceUsed(userId, executorId) {
        const orders = await Order.findAll({ where: { userId } });
        const orderIds = orders.map((order) => order.id);
        const anyBatch = await Batch.findOne({
            where: {
                orderId: {
                    [Op.in]: orderIds,
                },
                executorId,
            },
        });
        return anyBatch != null;
    }

    async createBatch(executorId, orderId, receivedMMR, isWin) {
        const uncompletedBatch = await this.getAnyUncompletedBatch(executorId);
        if (uncompletedBatch != null) {
            throw ApiError.BadRequest(
                `user has uncompleted batch ${uncompletedBatch.id}, load game-screen to complete`
            );
        }
        if (!(await orderService.isOrderBelongsToExecutor(orderId, executorId))) {
            throw ApiError.NoPermissions();
        }
        const orderModel = await orderService.getOrderModel(orderId);
        if (orderModel.closed) {
            throw ApiError.BadRequest("order was closed");
        }
        receivedMMR *= isWin ? 1 : -1;
        await orderService.addRatingPoints(orderModel, receivedMMR);
        const batch = await Batch.create({ executorId, orderId, receivedMMR, isWin });
        const batchData = new BatchDto(batch);
        return { batch: batchData };
    }

    // Returns batch if executor has batch without loaded screen. May be nullable.
    async getAnyUncompletedBatch(executorId) {
        return await Batch.findOne({ where: { executorId, screen: null } });
    }

    async loadScreen(executorId, batchId, screen) {
        const batch = await Batch.findOne({ where: { executorId, id: batchId } });
        if (!batch) {
            throw ApiError.BadRequest("batch not found");
        }
        if (batch.screen) {
            fileUtils.deleteStaticImage(batch.screen);
        }
        batch.screen = fileUtils.createStaticImage(screen, config.SCREEN_FILE_PREFIX);
        await batch.save();
        return { message: "success" };
    }
    async getBatch(batchId) {
        const batch = await Batch.findByPk(batchId);
        if (!batch) {
            throw ApiError.BadRequest("batch not found");
        }
        const batchData = new BatchDto(batch);
        return { batch: batchData };
    }
    async getBatches(options) {
        const batches = await Batch.findAll({
            limit: config.DB_BATCH_SEARCH_LIMIT,
            offset: options.offset,
            where: createFilter(options, config.ALLOWED_BATCH_FILTERS),
        });
        const batchesData = batches.map((batch) => new BatchDto(batch));
        return { batches: batchesData };
    }
}

module.exports = new BatchService();
