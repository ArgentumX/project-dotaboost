const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
})

const ExecutingOrder = sequelize.define('executing_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ExecutingOrder)
ExecutingOrder.belongsTo(User)

Order.hasOne(ExecutingOrder)
ExecutingOrder.belongsTo(Order)

module.exports = {
    User, Order, ExecutingOrder
}