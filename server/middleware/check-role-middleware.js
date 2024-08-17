const jwt = require("jsonwebtoken");
const { User, UserRole, Role } = require("../models/models");
const config = require("../config");
const users = require("../services/user-service");
const ApiError = require("../errors/api-error");

// TODO replace to roleService
module.exports = function (roleTitle) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const decoded = req.user;
      const userWithRole = await User.findByPk(decoded.id, {
        include: [
          {
            model: Role,
            where: { title: roleTitle },
          },
        ],
      });
      if (!userWithRole) {
        return next(ApiError.NoPermissions());
      }
      next();
    } catch (e) {
      return next(ApiError.NoPermissions());
    }
  };
};
