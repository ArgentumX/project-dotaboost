module.exports = class UserDto {
    id;
    email;
    username;
    isActivated;
    balance;
    avatar;
    roles;
    lastIp;

    constructor(model, roles, hideSecretData = true, lastIp = undefined) {
        this.id = model.id;
        this.avatar = model.avatar;
        this.username = model.username;
        this.roles = roles;
        if (!hideSecretData) {
            this.email = model.email;
            this.isActivated = model.isActivated;
            this.balance = model.balance;
            this.lastIp = lastIp;
        }
    }
};
