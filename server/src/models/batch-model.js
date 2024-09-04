const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const Batch = sequelize.define("batch", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    screen: { type: DataTypes.STRING },
    receivedMMR: { type: DataTypes.INTEGER, allowNull: false },
    isWin: { type: DataTypes.BOOLEAN, allowNull: false },
});

module.exports = { Batch };
