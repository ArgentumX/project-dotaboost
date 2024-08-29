const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const TgHook = sequelize.define("tgHook", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hookKey: { type: DataTypes.STRING(64) },
    chatId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = { TgHook };
