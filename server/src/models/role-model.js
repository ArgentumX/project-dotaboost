const sequelize = require("../db.js");
const { DataTypes } = require("sequelize");

const Role = sequelize.define("role", {
    title: { type: DataTypes.STRING(16), primaryKey: true, allowNull: false },
    display: { type: DataTypes.BOOLEAN, defaultValue: true },
    allowAdding: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = { Role };
