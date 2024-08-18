module.exports = class ExecutorTicketDto {
    id;
    image;
    requiredUsername;
    verified;
    paid;
    closed;

    constructor(model) {
        this.id = model.id;
        this.image = model.image;
        this.requiredUsername = model.requiredUsername;
        this.verified = model.verified;
        this.paid = model.paid;
        this.closed = model.closed;
    }
};
