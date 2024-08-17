module.exports = class UserDto {
  id;
  email;
  username;
  isActivated;
  balance;
  avatar;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.avatar = model.avatar;
    this.username = model.username;
  }
};
