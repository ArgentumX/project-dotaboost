module.exports = class OrderDto {
  id;
  party;
  priority;
  steamGuard;
  playTime;
  steamUsername;
  steamPassword;
  // Set hideExecutorInfo to true for anybody and false for executors of this order
  constructor(model) {
    this.id = model.id;
    this.party = model.party;
    this.priority = model.priority;
    this.steamGuard = model.steamGuard;
    this.playTime = model.playTime;
  }
};
