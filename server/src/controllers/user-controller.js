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
const commentService = require("../services/comment-service");
const mailService = require("../services/mail-service");
const executorService = require("../services/executor-service");
const tgBotService = require("../services/tg-bot-service");
const chatService = require("../services/chat-service");
const requestIp = require("request-ip");

class UserController {
    async registration(req, res, next) {
        try {
            const { email, username, password } = req.body;
            const valErrors = validationResult(req);
            const clientIp = requestIp.getClientIp(req);

            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const userData = await userService.registration(email, username, password, clientIp);
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
            const clientIp = requestIp.getClientIp(req);
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                return next(ApiError.ValidationError(valErrors));
            }
            const userData = await userService.login(email, password, clientIp);
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
            const clientIp = requestIp.getClientIp(req);
            const userData = await userService.refresh(refreshToken, clientIp);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: config.REFRESH_TOKEN_DAY_LIFETIME * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async uploadAvatar(req, res, next) {
        try {
            const image = req.files.image;
            const userData = req.user;
            const avatar = await userService.uploadAvatar(userData.id, image);
            return res.json(avatar);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }
    async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const userId = req.user.id;
            const userData = await userService.changePassword(userId, oldPassword, newPassword);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: config.REFRESH_TOKEN_DAY_LIFETIME * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const userData = await userService.getUser(id);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getExecutorByUserId(req, res, next) {
        try {
            const { userId, loadUserData = false } = req.body;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            return res.json(await executorService.getExecutorByUserId(userId, loadUserData));
        } catch (e) {
            next(e);
        }
    }

    async recoverAccess(req, res, next) {
        try {
            const { recoverToken, newPassword } = req.body;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const userData = await userService.recoverAccess(recoverToken, newPassword);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: config.REFRESH_TOKEN_DAY_LIFETIME * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async sendRecoverMail(req, res, next) {
        try {
            const { email } = req.body;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const recoverLink = await userService.getRecoverLink(email);
            await mailService.sendRecoverMail(email, recoverLink);
            return res.json({ message: "success" });
        } catch (e) {
            next(e);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const { chatId } = req.params;
            const { text } = req.body;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const result = await chatService.handleSendMessageRequest(userId, chatId, text);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getChatMessages(req, res, next) {
        try {
            const { chatId } = req.params;
            const { offset } = req.query;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const result = await chatService.handleGetChatMessagesRequest(userId, chatId, offset);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async getChat(req, res, next) {
        try {
            const { chatId } = req.params;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const result = await chatService.handleGetChatRequest(userId, chatId);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async hookTelegram(req, res, next) {
        try {
            const { hookKey } = req.body;
            const userId = req.user.id;
            const valErrors = validationResult(req);
            if (!valErrors.isEmpty()) {
                throw ApiError.ValidationError(valErrors);
            }
            const result = await tgBotService.hookAccount(userId, hookKey);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
