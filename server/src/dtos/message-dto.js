module.exports = class MessageDto {
    id;
    text;
    userId;
    chatId;

    constructor(model) {
        this.id = model.id;
        this.text = model.text;
        this.userId = model.userId;
        this.chatId = model.chatId;
    }
};
