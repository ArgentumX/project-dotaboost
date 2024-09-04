const { Op } = require("sequelize");
const config = require("../config");
const ChatDto = require("../dtos/chat-dto");
const MessageDto = require("../dtos/message-dto");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../errors/api-error");
const { Chat } = require("../models/chat-model");
const { Message } = require("../models/message-model");
const { User, UserChat } = require("../models/user-model");
const userService = require("./user-service");
const socketService = require("./socket-service");

class ChatService {
    async handleGetChatMessagesRequest(userId, chatId, offset) {
        if (!(await this.isChatMember(userId, chatId))) {
            throw ApiError.BadRequest("user are not member of this chat");
        }
        return await this.getChatMessages(chatId, offset);
    }
    async handleSendMessageRequest(userId, chatId, text) {
        return await this.sendMessage(userId, chatId, text);
    }

    async handleGetChatRequest(userId, chatId) {
        if (!(await this.isChatMember(userId, chatId))) {
            throw ApiError.BadRequest("user are not member of this chat");
        }
        return await this.getChat(chatId);
    }

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

    async getChatModel(chatId) {
        const chatModel = await Chat.findByPk(chatId);
        if (!chatModel) {
            throw ApiError.BadRequest("chat not found");
        }
        return chatModel;
    }

    async sendMessage(userId, chatId, text, force = false) {
        if (!(await this.isChatMember(userId, chatId)) && !force) {
            throw ApiError.BadRequest("user is not member of this chat");
        }
        const message = await Message.create({ text, userId, chatId });
        const messageData = new MessageDto(message);
        const usersId = (await this.getChatMembersId(chatId)).filter((value) => value !== userId);
        socketService.sendMessageToChatMembers(usersId, { message: messageData });
        return { message: messageData };
    }

    async addChatMember(chatId, userId) {
        const chat = await this.getChatModel(chatId);
        const user = await userService.getUserModel(userId);
        await chat.addUser(user);
        return { message: "success" };
    }

    async getChatMessages(chatId, offset = 0) {
        const messages = await Message.findAll({
            limit: config.DB_MESSAGES_SEARCH_LIMIT,
            offset,
            where: { chatId },
            include: [{ model: User }],
        });
        const messagesData = messages.map((message) => new MessageDto(message));
        const usersData = this.getUsersByMessageModels(messages);
        return { messages: messagesData, users: usersData };
    }

    async getChatMembersId(chatId) {
        return (await UserChat.findAll({ where: { chatId } })).map((userChat) => userChat.userId);
    }

    getUsersByMessageModels(messageModels) {
        const users = [];
        for (const message of messageModels) {
            const author = message.user;
            if (!users.some((user) => user.id === author.id)) {
                users.push(new UserDto(author));
            }
        }
        return users;
    }
    async getChat(chatId) {
        const chat = await Chat.findByPk(chatId);
        const chatData = new ChatDto(chat);
        const { users, messages } = await this.getChatMessages(chatId);
        return { chat: chatData, users, messages };
    }

    async removeChatMember(chatId, userId) {
        const userChat = await UserChat.findOne({ where: { userId, chatId } });
        if (!userChat) {
            throw ApiError.BadRequest("user are not member of this chat");
        }
        await userChat.destroy();
        return { message: "success" };
    }

    async isChatMember(userId, chatId) {
        const chatMember = await UserChat.findOne({ where: { userId, chatId } });
        return chatMember != null;
    }
}

module.exports = new ChatService();
