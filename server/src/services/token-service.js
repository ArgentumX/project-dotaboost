const ApiError = require("../errors/api-error");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { Token } = require("../models/token-model");

class TokenService {
    generateAuthTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: `${config.ACCESS_TOKEN_MIN_LIFETIME}m`,
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: `${config.REFRESH_TOKEN_DAY_LIFETIME}d`,
        });

        return {
            accessToken,
            refreshToken,
        };
    }
    generateRecoverToken(payload) {
        const recoverToken = jwt.sign(payload, process.env.JWT_RECOVER_SECRET, {
            expiresIn: `${config.RECOVER_TOKEN_MIN_LIFETIME}m`,
        });

        return recoverToken;
    }

    validateAccessToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return tokenData;
        } catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return tokenData;
        } catch (e) {
            return null;
        }
    }
    validateRecoverToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.JWT_RECOVER_SECRET);
            return tokenData;
        } catch (e) {
            return null;
        }
    }
    async saveToken(userId, token, tokenType, ip) {
        const tokenData = await Token.findOne({ where: { userId, tokenType } });
        if (tokenData) {
            tokenData.token = token;
            return await tokenData.save();
        }
        return await Token.create({ token, userId, tokenType, ip });
    }

    async removeToken(token) {
        await Token.destroy({ where: { token } });
        return { message: "success" };
    }
    async removeUserTokens(userId) {
        await Token.destroy({ where: { userId } });
        return { message: "success" };
    }
    async findToken(token) {
        const tokenData = await Token.findOne({ where: { token } });
        return tokenData;
    }
    async findTokenByType(userId, tokenType) {
        const tokenData = await Token.findOne({ where: { userId, tokenType } });
        return tokenData;
    }
}
module.exports = new TokenService();
