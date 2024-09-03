module.exports = class MessageDto {
    id;
    text;
    userId;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.userId = model.userId;
    }
};
