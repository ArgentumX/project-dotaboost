const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");
const { User, UserChat } = require("./user-model.js");
const { Role } = require("./role-model.js");
const { UserRole } = require("./user-model.js");
const { ExecutorComment } = require("./comment-model.js");
const { ExecutorRate } = require("./rate-model.js");
const { Batch } = require("./batch-model.js");
const { Message } = require("./message-model.js");
const { Chat } = require("./chat-model.js");

const roleService = require("../services/role-service.js");
const config = require("../config");
const { Token } = require("./token-model.js");

// TODO rework models.js
const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    party: { type: DataTypes.BOOLEAN, defaultValue: false },
    priority: { type: DataTypes.BOOLEAN, defaultValue: false },
    steamGuard: { type: DataTypes.BOOLEAN, defaultValue: false },
    playTime: { type: DataTypes.JSON },
    steamUsername: { type: DataTypes.STRING(32), allowNull: false },
    steamPassword: { type: DataTypes.STRING(64), allowNull: false },
    vk: { type: DataTypes.STRING(64) },
    telegram: { type: DataTypes.STRING(64) },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    closed: { type: DataTypes.BOOLEAN, defaultValue: false },
    startRating: { type: DataTypes.INTEGER, allowNull: false },
    currentRating: { type: DataTypes.INTEGER },
    endRating: { type: DataTypes.INTEGER, allowNull: false },
});

// Сreates upon special verification
const Executor = sequelize.define("executor", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completedOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const ExecutorTicket = sequelize.define("executorTicket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image: { type: DataTypes.STRING },
    requiredUsername: { type: DataTypes.STRING(32), allowNull: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    closed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ExecutorComment);
ExecutorComment.belongsTo(User);

User.belongsToMany(Chat, { through: UserChat });
Chat.belongsToMany(User, { through: UserChat });

Chat.hasMany(Message);
Message.belongsTo(Chat);

User.hasMany(Message);
Message.belongsTo(User);

User.hasOne(Executor);
Executor.belongsTo(User);

User.hasMany(ExecutorRate);
ExecutorRate.belongsTo(User);

Executor.hasMany(ExecutorComment);
ExecutorComment.belongsTo(Executor);

Executor.hasMany(Batch);
Batch.belongsTo(Executor);

Executor.hasMany(ExecutorRate);
ExecutorRate.belongsTo(Executor);

Order.hasOne(Executor);
Executor.belongsTo(Order);

Order.hasMany(Batch);
Batch.belongsTo(Order);

User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });
// Set up of user default role;
User.afterCreate(async (user, options) => {
    roleService.addUserRole(user, config.ROLES.DEFAULT_ROLE_ID);
});

User.hasMany(ExecutorTicket);
ExecutorTicket.belongsTo(User);

User.hasMany(Token);
Token.belongsTo(User);

module.exports = {
    Order,
    Executor,
    ExecutorTicket,
};
