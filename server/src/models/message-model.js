const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const Message = sequelize.define("message", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = { Message };
