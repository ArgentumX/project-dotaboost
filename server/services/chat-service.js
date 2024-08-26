const ChatDto = require("../dtos/chat-dto");
const ApiError = require("../errors/api-error");
const { Chat } = require("../models/chat-model");
const { Message } = require("../models/message-model");
const { User, UserChat } = require("../models/user-model");

class ChatService {
    // TODO rework
    async createChat(userIds) {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: userIds,
                },
            },
        });
        if (users.length !== userIds.length) {
            throw ApiError.BadRequest("cant find all required users");
        }
        const chat = await Chat.create({});
        await chat.addUsers(users);
        return { chat: new ChatDto(chat) };
    }

    // TODO rework
    async addMessage(userId, chatId, text) {
        if (!(await this.isChatMember(userId, chatId))) {
            throw ApiError.BadRequest("user is not member of this chat");
        }

        const message = await Message.create({ text, userId, chatId });
    }

    // TODO rework
    async isChatMember(userId, chatId) {
        const chatMember = await UserChat.findOne({ where: { userId, chatId } });
        return chatMember != null;
    }
}

module.exports = new ChatService();
