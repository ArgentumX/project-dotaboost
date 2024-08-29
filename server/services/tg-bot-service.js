const ApiError = require("../errors/api-error");
const config = require("../config");
const { TgHook } = require("../models/tg-hook-model");
const TelegramBot = require("node-telegram-bot-api");
const { generateRandomString } = require("../utils/utils");
const TgHookDto = require("../dtos/tg-hook-dto");
const userService = require("./user-service");

function generateTgHookKey(tgHookModel) {
    const id = tgHookModel.id;
    return `${id}-${generateRandomString(10)}`;
}

const _bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

function sendMessage(chatId, message) {
    _bot.sendMessage(chatId, message);
}

class TgBotService {
    async sendMessageByUserId(userId, message) {
        const tgHook = await TgHook.findOne({ where: { userId } });
        if (!tgHook) {
            return { message: "failed" };
        }
        sendMessage(tgHook.chatId, message);
        return { message: "success" };
    }

    async hookAccount(userId, hookKey) {
        const user = await userService.getUserModel(userId);
        const tgHookByUserId = await TgHook.findOne({ where: { userId: user.id } });
        if (tgHookByUserId) {
            throw ApiError.BadRequest("Account was already hooked");
        }
        const tgHookByHookKey = await TgHook.findOne({ where: { hookKey } });
        if (!tgHookByHookKey) {
            throw ApiError.BadRequest("hook key not found");
        }
        user.setTgHook(tgHookByHookKey);
        return { message: "success" };
    }

    async createTgHook(chatId) {
        const tgHook = await TgHook.create({ chatId });
        tgHook.hookKey = generateTgHookKey(tgHook);
        await tgHook.save();
        const tgHookData = new TgHookDto(tgHook);
        return { tgHook: tgHookData };
    }

    async isChatHooked(chatId) {
        const tgHook = await TgHook.findOne({ where: { chatId } });
        return tgHook != null;
    }
}

const tgBotService = new TgBotService();
_bot.on("message", async function (msg) {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
        if (await tgBotService.isChatHooked(chatId)) {
            _bot.sendMessage(chatId, "Ваш аккаунт уже привязан к телеграму");
        } else {
            const { tgHook } = await tgBotService.createTgHook(chatId);
            _bot.sendMessage(
                chatId,
                `Добро пожаловать ${msg.from.username}! \n Ваш ключ для привязки аккаунта: ${tgHook.hookKey}`
            );
        }
    }
});

module.exports = tgBotService;
