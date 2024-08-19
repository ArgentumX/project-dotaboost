const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");
const { User } = require("./user-model.js");
const { Role } = require("./role-model.js");

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

module.exports = { UserRole };
