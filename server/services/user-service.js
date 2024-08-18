const { User, Role, UserRole } = require("../models/models");
const config = require("../config");
const mailService = require("./mail-service");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
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

        const hashPassword = await bcrypt.hash(password, Number(process.env.HASH_REPEAT));
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
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
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
        const userDto = new UserDto(user);
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
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async getUser() {}
    async getUsers() {}

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
        const user = await User.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest("wrong activation link");
        }
        user.isActivated = true;
        await user.save();
    }
}

module.exports = new UserService();
