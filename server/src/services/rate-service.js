const ApiError = require("../errors/api-error");
const config = require("../config");
const { User } = require("../models/user-model");
const { Executor } = require("../models/models");
const { ExecutorComment } = require("../models/comment-model");
const ExecutorCommentDto = require("../dtos/executor-comment-dto");
const batchServices = require("./batch-services");
const { ExecutorRate } = require("../models/rate-model");
const ExecutorRateDto = require("../dtos/executor-rate-dto");

class GradeService {
    // isLike = true <=> like, isLike = false <=> dislike
    async addExecutorRate(userId, executorId, isLike) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const executor = await Executor.findByPk(executorId);
        if (!executor) {
            throw ApiError.BadRequest("executor not found");
        }
        const usedService = await batchServices.isExecutorServiceUsed(userId, executorId);
        if (!usedService) {
            throw ApiError.NoPermissions();
        }
        const likedBefore = await this.isExecutorRated(userId, executorId);
        if (likedBefore) {
            await this.removeExecutorRate(userId, executorId);
        }
        const like = await ExecutorRate.create({ userId, executorId, isLike });
        const likeData = new ExecutorRateDto(like);
        return { like: likeData };
    }

    async removeExecutorRate(userId, executorId) {
        const like = await ExecutorRate.findOne({ where: { userId, executorId } });
        if (!like) {
            throw ApiError.BadRequest("like not found");
        }
        await like.destroy();
        return { message: "success" };
    }

    async isExecutorRated(userId, executorId) {
        const liked = await ExecutorRate.findOne({ where: { userId, executorId } });
        return liked != null;
    }

    // Additionally returns userRated = true if user rated this executor
    async getExecutorRates(userId, executorId) {
        const rates = await ExecutorRate.findAll({ where: { executorId } });
        let likes = 0,
            dislikes = 0,
            userRated,
            userRate;
        rates.map((rate) => {
            if (rate.isLike) {
                likes++;
            } else {
                dislikes++;
            }
            if (rate.userId == userId) {
                userRated = true;
                userRate = new ExecutorRateDto(rate);
            }
        });
        return { likes, dislikes, userRated, userRate };
    }
}

module.exports = new GradeService();
