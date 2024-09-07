const { User } = require("../models/user-model");
const config = require("../config");
const mailService = require("./mail-service");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
const roleService = require("./role-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../errors/api-error");
const fileUtils = require("../utils/file-utils");
const { Executor } = require("../models/models");
const ipUtils = require("ip-matching");

async function _setPassword(user, password) {
    const passwordHash = await this.getPasswordHash(password);
    user.password = passwordHash;
    await user.save();
    await this.logoutById(user.id);
    return await this.createUserTokens(user);
}

class UserService {
    async registration(email, username, password, ip) {
        const candidateByUsername = await User.findOne({ where: { username } });
        if (candidateByUsername) {
            throw ApiError.BadRequest("username is already in use");
        }

        const candidateByEmail = await User.findOne({ where: { email } });
        if (candidateByEmail) {
            throw ApiError.BadRequest("email is already in use");
        }

        const hashPassword = await this.getPasswordHash(password);
        const activationLink = uuid.v4();

        const user = await User.create({
            email,
            username,
            password: hashPassword,
            activationLink,
        });
        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/user/activate/${activationLink}`
        );
        return await this.createUserTokens(user, ip);
    }

    async getUserModel(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        return user;
    }

    async getPasswordHash(password) {
        return bcrypt.hash(password, Number(process.env.HASH_REPEAT));
    }

    async login(email, password, ip) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest("Wrong email or password");
        }
        if (await this.isBanned(user.id)) {
            throw ApiError.NoPermissions();
        }

        const isRightPassword = await bcrypt.compare(password, user.password);
        if (!isRightPassword) {
            throw ApiError.BadRequest("Wrong email or password");
        }
        return await this.createUserTokens(user, ip);
    }

    async createUserTokens(user, ip) {
        const roles = await roleService.getUserRoles(user.id);
        const userDto = new UserDto(user, roles, false);
        const tokens = tokenService.generateAuthTokens({ ...userDto });
        await tokenService.saveToken(
            userDto.id,
            tokens.refreshToken,
            config.TOKENS.TYPE.REFRESH,
            ip
        );
        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        return await tokenService.removeToken(refreshToken);
    }

    async logoutById(userId) {
        if (!userId) {
            throw ApiError.ValidationError();
        }
        return await tokenService.removeUserTokens(userId);
    }

    async refresh(refreshToken, ip) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        if (await this.isBanned(userData.id)) {
            throw ApiError.NoPermissions();
        }
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb || !ipUtils.matches(tokenFromDb.ip, ip)) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findByPk(userData.id);
        return await this.createUserTokens(user, ip);
    }

    async getUser(userId, loadRolesData = false, hideSecretData = true) {
        let roles;
        const user = await this.getUserModel(userId);
        if (loadRolesData) {
            roles = await roleService.getUserRoles(user.id);
        }
        const userData = new UserDto(user, roles, hideSecretData, await this.getLastIp(userId));
        return { user: userData };
    }

    async uploadAvatar(userId, image) {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        if (user.avatar) {
            fileUtils.deleteStaticImage(user.avatar);
        }
        user.avatar = fileUtils.createStaticImage(image, config.AVATAR_FILE_PREFIX);
        await user.save();
        return { avatar: user.avatar };
    }

    async activate(activationLink) {
        const user = await User.findOne({ where: { activationLink } });
        if (!user) {
            throw ApiError.BadRequest("wrong activation link");
        }
        user.isActivated = true;
        await user.save();
        return { message: "success" };
    }

    async getRecoverLink(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const userData = new UserDto(user, undefined, false);
        const recoverToken = tokenService.generateRecoverToken({ ...userData });
        await tokenService.saveToken(user.id, recoverToken, config.TOKENS.TYPE.RECOVER);
        return `${process.env.CLIENT_URL}/password_reset/${recoverToken}`;
    }

    async changePassword(userId, oldPassword, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const isRightPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isRightPassword) {
            throw ApiError.BadRequest("Wrong email or password");
        }
        return await _setPassword(user, newPassword);
    }

    async recoverAccess(token, newPassword) {
        const tokenData = tokenService.validateRecoverToken(token);
        const tokenFromDb = await tokenService.findToken(token);
        if (!tokenData || !tokenFromDb) {
            throw ApiError.BadRequest("wrong token or expired");
        }
        const user = await User.findByPk(tokenData.id);
        if (!user) {
            throw ApiError.BadRequest(config.MESSAGES.USER_NOT_FOUND);
        }
        return await _setPassword(user, newPassword);
    }

    async isExecutor(userId) {
        const executor = await Executor.findOne({ where: { userId } });
        return executor != null;
    }

    // May return null
    async getLastIp(userId) {
        const token = await tokenService.findToken(userId, config.TOKENS.TYPE.REFRESH);
        return token ? token.ip : null;
    }

    async isBanned(userId) {
        return await roleService.hasRole(userId, config.ROLES.LIST.banned.title);
    }
    async isPostBanned(userId) {
        return await roleService.hasRole(userId, config.ROLES.LIST.post_ban.title);
    }
    async isAdmin(userId) {
        return await roleService.hasRole(userId, config.ROLES.LIST.admin.title);
    }
}

module.exports = new UserService();
