const ApiError = require("../errors/api-error");
const config = require("../config");
const { User } = require("../models/user-model");
const { Executor } = require("../models/models");
const { ExecutorComment } = require("../models/comment-model");
const ExecutorCommentDto = require("../dtos/executor-comment-dto");
const { isExecutorServiceUsed } = require("./batch-services");

class CommentService {
    async postExecutorComment(userId, executorId, text) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const executor = await Executor.findByPk(executorId);
        if (!executor) {
            throw ApiError.BadRequest("executor not found");
        }
        const usedService = await batchServices.isExecutorServiceUsed(user, executor);
        if (!usedService) {
            throw ApiError.NoPermissions();
        }
        const commentedBefore = await this.isExecutorCommented(userId, executorId);
        if (commentedBefore) {
            throw ApiError.BadRequest("unable to comment more one time");
        }
        const comment = await ExecutorComment.create({ userId, executorId, text });
        const commentData = new ExecutorCommentDto(comment);
        return { comment: commentData };
    }

    // Checks if executor commented by specific user.
    async isExecutorCommented(byUserId, executorId) {
        const comment = await ExecutorComment.findOne({ where: { userId: byUserId, executorId } });
        return comment != null;
    }

    async getExecutorComments(executorId) {
        const comments = await ExecutorComment.findAll({ where: { executorId } });
        const commentsData = comments.map((comments) => new ExecutorCommentDto(comments));
        return { comments: commentsData };
    }
}

module.exports = new CommentService();
