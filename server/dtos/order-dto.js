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
    // Set hideSecretData to true for anybody and false for executors of this order
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
        if (!hideSecretData) {
            this.steamUsername = model.steamUsername;
            this.steamPassword = model.steamPassword;
        }
    }
};
