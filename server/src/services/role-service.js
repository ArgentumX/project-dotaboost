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

    async getRoleModel(roleTitle) {
        const role = await Role.findByPk(roleTitle);
        if (!role) {
            throw ApiError.BadRequest("role not found");
        }
        return role;
    }

    async addUserRole(userModel, roleTitle) {
        const role = await this.getRoleModel(roleTitle);
        if (!role.allowAdding) {
            throw ApiError.NoPermissions();
        }
        if (!(await userModel.hasRole(role))) {
            await userModel.addRole(role);
        }
        return { message: "success" };
    }

    async removeUserRole(userModel, roleTitle) {
        const role = await this.getRoleModel(roleTitle);
        if (await userModel.hasRole(role)) {
            await userModel.removeRoles([roleTitle]);
        }
        return { message: "success" };
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
    async hasRole(userId, roleTittle) {
        const role = await UserRole.findOne({ where: { userId, roleId: roleTittle } });
        return role != null;
    }
}

module.exports = new RoleService();
