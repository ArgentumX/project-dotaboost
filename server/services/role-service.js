const ApiError = require("../errors/api-error");
const { Role } = require("../models/role-model");
const config = require("../config");
const { User, UserRole } = require("../models/user-model");

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

    async getUserRoles(userId) {
        const userRolesData = await UserRole.findAll({ where: { userId } });
        if (userRolesData == []) {
            throw ApiError.Internal("roles cant be empty");
        }
        const roles = [];
        for (const roleData of userRolesData) {
            roles.push(roleData.roleId);
        }
        return roles;
    }
}

module.exports = new RoleService();
