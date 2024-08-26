const ApiError = require("../errors/api-error");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { Token } = require("../models/token-model");

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
    async saveToken(userId, token) {
        const tokenData = await Token.findOne({ where: { userId } });
        if (tokenData) {
            tokenData.token = token;
            return tokenData.save();
        }
        return await Token.create({ token, userId });
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
}
module.exports = new TokenService();
