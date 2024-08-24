module.exports = class BatchDto {
    id;
    isWin;
    receivedMMR;
    orderId;
    executorId;
    screen;

    constructor(model) {
        this.id = model.id;
        this.isWin = model.isWin;
        this.receivedMMR = model.receivedMMR;
        this.orderId = model.orderId;
        this.executorId = model.executorId;
        this.screen = model.screen;
    }
};
