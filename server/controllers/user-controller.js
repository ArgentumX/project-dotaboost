const ApiError = require("../errors/api-error");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const Uuid = require("uuid");
const path = require("path");
const { validationResult } = require("express-validator");
const files = require("../utils/file-utils");
const config = require("../config");
const userService = require("../services/user-service");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("validation error", errors));
      }
      const userData = await userService.registration(
        email,
        username,
        password
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: config.REFRESH_TOKEN_DAY_LIFETIME * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const valErrors = validationResult(req);
      if (!valErrors.isEmpty()) {
        return next(ApiError.BadRequest("validation error"));
      }
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: config.REFRESH_TOKEN_DAY_LIFETIME * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: config.REFRESH_TOKEN_DAY_LIFETIME * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  // TODO rework (validation)
  async uploadAvatar(req, res, next) {
    try {
      const image = req.files.file;
      const userData = req.user;
      const avatar = await userService.uploadAvatar(userData.id, image);
      return res.json(avatar);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.activationLink;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
