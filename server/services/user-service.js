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

class UserService {
    async registration(email, username, password) {
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
        return await this.createUserTokens(user);
    }

    async getPasswordHash(password) {
        return bcrypt.hash(password, Number(process.env.HASH_REPEAT));
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest("Wrong email or password");
        }
        const isRightPassword = await bcrypt.compare(password, user.password);
        if (!isRightPassword) {
            throw ApiError.BadRequest("Wrong email or password");
        }
        return await this.createUserTokens(user);
    }

    async createUserTokens(user) {
        const roles = await roleService.getUserRoles(user.id);
        const userDto = new UserDto(user, roles, false);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
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

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findByPk(userData.id);
        return await this.createUserTokens(user);
    }

    async getUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const userData = new UserDto(user);
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

    async changePassword(userId, oldPassword, newPassword) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const isRightPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isRightPassword) {
            throw ApiError.BadRequest("Wrong email or password");
        }
        const newPasswordHash = await this.getPasswordHash(newPassword);
        user.password = newPasswordHash;
        await user.save();
        await this.logoutById(userId);
        return await this.createUserTokens(user);
    }

    async restorePassword() {}
}

module.exports = new UserService();
