const ApiError = require("../errors/api-error");
const { VerifyExecutorTicket, User } = require("../models/models");
const executors = require("../services/executor-service");
const config = require("../config");
const files = require("../utils/file-utils");

class ExecutorTicketController {
  async createTicket(req, res, next) {
    const { answers } = req.body;
    if (!answers) {
      return next(ApiError.badRequest("no answers obj"));
    }
    const decoded = req.user;
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(ApiError.badRequest("user not found"));
    }
    const openTicket = await VerifyExecutorTicket.findOne({
      where: { userId: decoded.id, closed: false },
    });
    if (openTicket) {
      return next(ApiError.badRequest("user already has opened ticket"));
    }
    const passedTest =
      executors.getTestPoints(answers) >= config.TEST.REQUIRED_POINTS;
    if (!passedTest) {
      return res.json({ message: "test not passed" });
    }
    const ticket = await VerifyExecutorTicket.create({
      requiredUsername: executors.generateRequiredUsername(10),
      passedTest,
    });
    await user.addVerifyExecutorTicket(ticket);
    return res.json({ message: "ticket was created", ticket });
  }

  async uploadScreen(req, res, next) {
    try {
      const image = req.files.file;
      if (!image) {
        return next(ApiError.badRequest("wrong input format"));
      }
      const decoded = req.user;
      const ticket = await VerifyExecutorTicket.findOne({
        where: { userId: decoded.id, closed: false },
      });
      if (!ticket) {
        return next(ApiError.badRequest("open ticket not found"));
      }
      if (ticket.image) {
        files.deleteStaticImage(ticket.image);
      }
      ticket.image = files.createStaticImage(image, config.SCREEN_FILE_PREFIX);
      await ticket.save();
      return res.json({ message: "screen was uploaded" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "upload avatar error" });
    }
  }

  async verifyExecutor(req, res, next) {
    const { ticketId } = req.body;
    if (!ticketId) {
      return next(ApiError.badRequest("wrong input format"));
    }
    const ticket = await VerifyExecutorTicket.findByPk(ticketId);
    if (!ticket) {
      return next(ApiError.badRequest("ticket not found"));
    }

    ticket.closed = true;
    await ticket.save();
    executors.createExecutor(ticket.userId);
    return res.json({ message: "executor verified" });
  }
}

module.exports = new ExecutorTicketController();
