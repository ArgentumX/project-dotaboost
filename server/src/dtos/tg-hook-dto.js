module.exports = class TgHookDto {
    id;
    chatId;
    hookKey;
    createdAt;

    constructor(model) {
        this.id = model.id;
        this.chatId = model.chatId;
        this.hookKey = model.hookKey;
        this.createdAt = model.createdAt;
    }
};
