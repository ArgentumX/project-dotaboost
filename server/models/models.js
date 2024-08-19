const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");
const { User } = require("./user-model.js");
const { Role } = require("./role-model.js");

// TODO rework models.js
const Token = sequelize.define("token", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING(400), allowNull: false },
});

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
});

// Сreates upon special verification
const Executor = sequelize.define("executor", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    completedOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const UserRole = sequelize.define("userRole", {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id",
        },
    },
    roleId: {
        type: DataTypes.STRING(16),
        references: {
            model: Role,
            key: "title",
        },
    },
});

const ExecutorTicket = sequelize.define("executorTicket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image: { type: DataTypes.STRING },
    requiredUsername: { type: DataTypes.STRING(32), allowNull: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    closed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Comment = sequelize.define("comment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
});

User.hasMany(Order);
Order.belongsTo(User);

User.hasOne(Executor);
Executor.belongsTo(User);

Order.hasOne(Executor);
Executor.belongsTo(Order);

User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });
// Set up of user default role;
/*User.afterCreate(async (user, options) => {
    roleService.addUserRole(user, config.ROLES.DEFAULT_ROLE_ID);
});*/

User.hasMany(ExecutorTicket);
ExecutorTicket.belongsTo(User);

User.hasMany(Comment, { foreignKey: "authorId" });
Comment.belongsTo(User, { foreignKey: "authorId" });

User.hasOne(Token);
Token.belongsTo(User);

User.hasMany(Comment, { foreignKey: "targetId" });
Comment.belongsTo(User, { foreignKey: "targetId" });

module.exports = {
    Order,
    Executor,
    UserRole,
    Token,
    ExecutorTicket,
};
