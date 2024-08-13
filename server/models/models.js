const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    username: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    balance: {type: DataTypes.FLOAT, defaultValue: 0.0},
    avatar: {type: DataTypes.STRING}, 
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    verifiedEmail: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    party: {type: DataTypes.BOOLEAN, defaultValue: false},
    priority: {type: DataTypes.BOOLEAN, defaultValue: false},
    steamGuard: {type: DataTypes.BOOLEAN, defaultValue: false},
    playTime: {type: DataTypes.JSON },
    steamNickname: { type: DataTypes.STRING(32), allowNull: false },
    steamPassword: { type: DataTypes.STRING(64), allowNull: false },
    vk: {type: DataTypes.STRING(64)},
    telegram: {type: DataTypes.STRING(64)},
})

// Сreated upon special verification
const Executor = sequelize.define('executor', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    completedOrders: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING(16), allowNull: false},
    display: {type: DataTypes.BOOLEAN, defaultValue: true}
})

const UserRole = sequelize.define('userRole', {
    userId: { type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    roleId: { type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id'
      }
    }
  })

const VerifyExecutorTicket = sequelize.define('verifyExecutorTicket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    testPoints: {type: DataTypes.BOOLEAN, defaultValue: false},
    image: {type: DataTypes.STRING},
    requiredUsername: {type: DataTypes.STRING(32), allowNull: false},
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    paid: {type: DataTypes.BOOLEAN, defaultValue: false},
    closed: {type: DataTypes.BOOLEAN, defaultValue: false},
}) 


User.hasMany(Order)
Order.belongsTo(User)

User.hasOne(Executor)
Executor.belongsTo(User)

Order.hasOne(Executor)
Executor.belongsTo(Order)

User.belongsToMany(Role, { through: UserRole })
Role.belongsToMany(User, { through: UserRole})

User.hasMany(VerifyExecutorTicket)
VerifyExecutorTicket.belongsTo(User)

module.exports = {
    User, Order, Executor, Role, UserRole, VerifyExecutorTicket
}