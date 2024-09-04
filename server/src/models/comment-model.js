const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const ExecutorComment = sequelize.define("executorComment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = { ExecutorComment };
