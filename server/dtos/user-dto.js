const ApiError = require("../errors/api-error");

module.exports = class UserDto {
    id;
    email;
    username;
    isActivated;
    balance;
    avatar;
    roles;

    constructor(model, roles) {
        if (!roles) {
            throw ApiError.Internal("user roles cant be undefined");
        }
        this.id = model.id;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.avatar = model.avatar;
        this.balance = model.balance;
        this.username = model.username;
        this.roles = roles;
    }
};
