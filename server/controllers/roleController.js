const ApiError = require("../errors/ApiError")
const {Order, User, Executor, Role, UserRole} = require('../models/models')
const config = require("../config")

class RoleController {

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
            console.error('Roles creation error: ', error)
        }
    }
    
}

module.exports = new RoleController()
