module.exports = class ExecutorRateDto {
    id;
    like;
    executorId;
    userId;

    constructor(model) {
        this.id = model.id;
        this.executorId = model.executorId;
        this.isLike = model.isLike;
        this.userId = model.userId;
    }
};
