const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const ExecutorRate = sequelize.define("executorRate", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isLike: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
});

module.exports = { ExecutorRate };
