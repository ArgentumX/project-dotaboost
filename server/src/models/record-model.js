const config = require("../config/index.js");
const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const Record = sequelize.define("record", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recordType: { type: DataTypes.ENUM(Object.values(config.RECORDS.TYPE)), allowNull: false },
    message: { type: DataTypes.STRING(512), allowNull: false },
});

module.exports = { Record };
