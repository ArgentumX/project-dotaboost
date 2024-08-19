const ApiError = require("../errors/api-error");
const { ExecutorTicket } = require("../models/models");
const { User } = require("../models/user-model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const ExecutorTicketDto = require("../dtos/executor-ticket-dto");
const fileUtils = require("../utils/file-utils");

class ExecutorTicketService {
    async createTicket(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.BadRequest("user not found");
        }
        const openTicket = await ExecutorTicket.findOne({
            where: { userId, closed: false },
        });
        if (openTicket) {
            throw ApiError.BadRequest("user already has opened ticket");
        }
        const ticket = await ExecutorTicket.create({
            requiredUsername: this.generateRequiredUsername(10),
        });
        await user.addExecutorTicket(ticket);
        const ticketData = new ExecutorTicketDto(ticket);
        return { ticket: ticketData };
    }

    // Important: automatically removes from db old tickets
    async closeTicket(ticketId) {
        const ticket = await ExecutorTicket.findByPk(ticketId);
        if (!ticket) {
            throw ApiError.BadRequest("ticket not found");
        }

        const hasAnotherClosedTicket = await ExecutorTicket.findOne({
            where: { userId: ticket.userId, closed: true },
        });
        if (hasAnotherClosedTicket) {
            this.removeTicket(hasAnotherClosedTicket.id);
        }
        ticket.closed = true;
        await ticket.save();
        const ticketData = new ExecutorTicketDto(ticket);
        return { ticket: ticketData };
    }

    async acceptVerification(ticketId) {
        const ticket = await ExecutorTicket.findByPk(ticketId);
        if (!ticket) {
            throw ApiError.BadRequest("ticket not found");
        }
        if (ticket.closed || ticket.verified) {
            throw ApiError.BadRequest("ticket already was closed or verified");
        }
        ticket.verified = true;
        await ticket.save();
        return { ticket: new ExecutorTicketDto(ticket) };
    }

    async rejectVerification(ticketId) {
        const ticket = await ExecutorTicket.findByPk(ticketId);
        if (!ticket) {
            throw ApiError.BadRequest("ticket not found");
        }
        if (ticket.verified || ticket.closed) {
            throw ApiError.BadRequest("ticket already was closed or verified");
        }
        return this.closeTicket(ticketId);
    }

    async removeTicket(ticketId) {
        await ExecutorTicket.drop({ where: { id: ticketId } });
        return { message: "success" };
    }
    async uploadScreen(userId, image) {
        const ticket = await ExecutorTicket.findOne({ where: { userId, closed: false } });
        if (!ticket) {
            throw ApiError.BadRequest("open ticket not found");
        }
        if (ticket.image) {
            fileUtils.deleteStaticImage(ticket.image);
        }
        ticket.image = fileUtils.createStaticImage(image, config.SCREEN_FILE_PREFIX);
        await ticket.save();
        return { screen: ticket.image };
    }
    generateRequiredUsername(length) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            result += alphabet[randomIndex];
        }
        return result;
    }
}

module.exports = new ExecutorTicketService();
