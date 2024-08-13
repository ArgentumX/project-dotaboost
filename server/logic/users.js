const ApiError = require("../errors/ApiError")
const {Order, User, Executor, Role, UserRole} = require('../models/models')
const config = require("../config")
const jwt = require('jsonwebtoken')

class Users {
    getAuthUserJWTData(req, res, next){
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        return decoded
    }
}

module.exports = new Users()
