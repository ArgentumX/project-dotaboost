const ApiError = require("../errors/api-error");
const config = require("../config");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const _userSocketMap = new Map();
let _io;

class SocketService {
    init(server) {
        _io = new Server(server, {
            cors: process.env.CLIENT_URL,
            serveClient: false,
        });

        _io.on("connection", (socket) => {
            try {
                this._handleSocketConnection(socket);
            } catch (e) {}
        });
    }
    async _setUserSocket(userId, socketId) {
        _userSocketMap.set(userId, socketId);
    }
    async _deleteUserSocket(userId) {
        _userSocketMap.delete(userId);
    }
    async _handleSocketConnection(socket) {
        const accessToken = socket.handshake.auth.accessToken;
        if (!accessToken) {
            return;
        }
        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        this._setUserSocket(userData.id, socket.id);
        socket.on("disconnect", () => {
            this._deleteUserSocket(userData.id);
        });
    }

    // data fields example: { message, chat, user }
    async sendMessageToChatMembers(userIds, data) {
        for (const id of userIds) {
            if (_userSocketMap.has(id)) {
                _io.to(_userSocketMap.get(id)).emit("message", data);
            }
        }
    }
}

module.exports = new SocketService();
