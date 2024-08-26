const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const Token = sequelize.define("token", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING(400), allowNull: false },
    tokenType: { type: DataTypes.ENUM("REFRESH", "RECOVER"), allowNull: false },
});

module.exports = { Token };
