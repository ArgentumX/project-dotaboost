const ApiError = require("../errors/api-error");
const { Token } = require("../models/models");
const config = require("../config");
const jwt = require("jsonwebtoken");

class TokenService {
    generateTokens(payload) {
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

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await Token.create({ refreshToken, userId });
    }

    async removeToken(refreshToken) {
        await Token.destroy({ where: { refreshToken } });
        return { message: "success" };
    }
    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: { refreshToken } });
        return tokenData;
    }
}
module.exports = new TokenService();
