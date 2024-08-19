const ApiError = require("../errors/api-error");
const { Role } = require("../models/role-model");
const config = require("../config");

class RoleService {
    async initRoles() {
        const roles = config.ROLES.LIST;
        for (const key in roles) {
            if (roles.hasOwnProperty(key)) {
                const alreadyExists = await Role.findOne({
                    where: { title: roles[key].title },
                });
                if (!alreadyExists) {
                    await Role.create(roles[key]);
                }
            }
        }
    }

    // "user" type is model from models/models.js
    async addUserRole(user, roleTitle) {
        const role = await Role.findByPk(roleTitle);
        if (!role) {
            throw ApiError.BadRequest("role not found");
        }
        if (!(await user.hasRole(role))) {
            await user.addRole(role);
        }
    }
}

module.exports = new RoleService();
