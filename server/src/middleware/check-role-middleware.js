const jwt = require("jsonwebtoken");
const { User, UserRole } = require("../models/user-model");
const { Role } = require("../models/role-model");
const config = require("../config");
const users = require("../services/user-service");
const ApiError = require("../errors/api-error");
const roleService = require("../services/role-service");
const adminService = require("../services/admin-service");

// TODO replace to roleService
module.exports = function (roleTitle) {
    return async function (req, res, next) {
        try {
            const decoded = req.user;
            if (!roleService.hasRole(decoded.id, roleTitle)) {
                throw ApiError.NoPermissions();
            }
            if (
                roleTitle === config.ROLES.LIST.admin.title &&
                !(await adminService.isAdmin(decoded.id))
            ) {
                throw ApiError.NoPermissions();
            }
            next();
        } catch (e) {
            return next(ApiError.NoPermissions());
        }
    };
};
