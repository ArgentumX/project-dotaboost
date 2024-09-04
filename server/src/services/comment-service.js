const ApiError = require("../errors/api-error");
const config = require("../config");
const { User } = require("../models/user-model");
const { Executor } = require("../models/models");
const { ExecutorComment } = require("../models/comment-model");
const ExecutorCommentDto = require("../dtos/executor-comment-dto");
const batchServices = require("./batch-services");
const adminService = require("./admin-service");
const userService = require("./user-service");
const UserDto = require("../dtos/user-dto");

class CommentService {
    async getCommentModel(commentId) {
        const comment = await ExecutorComment.findByPk(commentId);
        if (!comment) {
            throw ApiError.BadRequest("comment not found");
        }
        return comment;
    }
    async postExecutorComment(userId, executorId, text) {
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
        const comments = await ExecutorComment.findAll({
            where: { executorId },
            include: [
                {
                    model: User,
                },
            ],
        });

        const commentsData = comments.map((comment) => new ExecutorCommentDto(comment));
        const usersData = comments.map((comment) => new UserDto(comment.user));
        return { comments: commentsData, users: usersData };
    }
    async removeComment(userId, commentId, force = false) {
        const comment = await this.getCommentModel(commentId);
        if (!force) {
            if (comment.userId !== userId && !(await adminService.isAdmin(userId))) {
                throw ApiError.NoPermissions();
            }
        }
        await comment.destroy({});
        return { message: "success" };
    }
}

module.exports = new CommentService();
