module.exports = class OrderDto {
    id;
    party;
    priority;
    steamGuard;
    playTime;
    steamUsername;
    steamPassword;
    closed;
    startRating;
    currentRating;
    endRating;
    chatId;

    constructor(model, hideSecretData = true) {
        this.id = model.id;
        this.party = model.party;
        this.priority = model.priority;
        this.steamGuard = model.steamGuard;
        this.playTime = model.playTime;
        this.startRating = model.startRating;
        this.closed = model.closed;
        this.endRating = model.endRating;
        this.currentRating = model.currentRating;
        this.chatId = model.chatId;
        if (!hideSecretData) {
            this.steamUsername = model.steamUsername;
            this.steamPassword = model.steamPassword;
        }
    }
};
