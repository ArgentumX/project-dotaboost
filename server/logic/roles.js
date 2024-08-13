const ApiError = require("../errors/ApiError")
const {Order, User, Executor, Role, UserRole} = require('../models/models')
const config = require("../config")

class Roles {

    async initRoles() {
        const roles = config.ROLES;
        try {
            for (const key in roles) {
                if (roles.hasOwnProperty(key)) {
                    let alreadyExists = await Role.findOne({where: {title: roles[key].title}})
                    if (!alreadyExists){
                        await Role.create(roles[key])
                    }
                }
            }
        } catch (error) {
            console.error('roles creation error: ', error)
        }
    }
    
    // "user" type is model from models/models.js
    async addUserRole(user, roleTitle){
        try {
            const role = await Role.findByPk(roleTitle)
            if (!(await user.hasRole(role))){
                await user.addRole(role)
            }
        } catch(e) {
            console.error('add user role error: ', e)
        }
    }
}

module.exports = new Roles()
