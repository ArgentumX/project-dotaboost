module.exports = class ExecutorDto {
    id;
    completedOrders;

    constructor(model) {
        this.id = model.id;
        this.completedOrders = model.completedOrders;
    }
};
