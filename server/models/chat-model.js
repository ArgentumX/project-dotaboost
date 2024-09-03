const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const Chat = sequelize.define("chat", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

module.exports = { Chat };
