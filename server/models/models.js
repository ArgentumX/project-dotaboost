const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    balance: {type: DataTypes.FLOAT, defaultValue: 0.0},
    avatar: {type: DataTypes.STRING}, 
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    verifiedEmail: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// Сreated upon special verification
const Executor = sequelize.define('executor', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    completedOrders: {type: DataTypes.INTEGER, defaultValue: 0}
})

User.hasMany(Order)
Order.belongsTo(User)

User.hasOne(Executor)
Executor.belongsTo(User)

Order.hasOne(Executor)
Executor.belongsTo(Order)

module.exports = {
    User, Order, Executor
}