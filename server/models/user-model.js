const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");
const { Role } = require("./role-model.js");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    avatar: { type: DataTypes.STRING },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: false,
    },
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

module.exports = { User, UserRole };
