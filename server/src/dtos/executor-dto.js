module.exports = class ExecutorDto {
    id;
    completedOrders;
    userId;

    constructor(model) {
        this.id = model.id;
        this.completedOrders = model.completedOrders;
        this.userId = model.userId;
    }
};
