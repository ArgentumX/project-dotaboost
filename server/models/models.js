const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const user = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
})

const executing_order = sequelize.define('executing_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

user.hasMany(order)
order.belongsTo(user)

user.hasMany(executing_order)
executing_order.belongsTo(user)

order.hasOne(executing_order)
executing_order.belongsTo(order)

module.exports = {
    user, order, executing_order
}