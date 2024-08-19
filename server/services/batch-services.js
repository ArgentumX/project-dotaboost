const ApiError = require("../errors/api-error");
const config = require("../config");
const { User } = require("../models/user-model");
const { Executor } = require("../models/models");
const { ExecutorComment } = require("../models/comment-model");
const ExecutorCommentDto = require("../dtos/executor-comment-dto");

class BatchService {
    // TODO rework
    async isExecutorServiceUsed(user, executor) {
        return true;
    }
}

module.exports = new BatchService();
