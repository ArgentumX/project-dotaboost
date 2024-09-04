module.exports = class ExecutorCommentDto {
    id;
    text;
    executorId;
    userId;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.executorId = model.executorId;
        this.userId = model.userId;
    }
};
