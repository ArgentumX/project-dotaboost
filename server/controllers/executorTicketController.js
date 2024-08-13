const ApiError = require("../errors/ApiError")
const {VerifyExecutorTicket, User} = require('../models/models')
const users = require('../logic/users')
const executors = require('../logic/executors')

class ExecutorTicketController {
    //Needs to be reworked later (try / catch protection)
    async createTicket(req, res, next){
        const decoded = users.getAuthUserJWTData(req, res, next)
        const ticket = await VerifyExecutorTicket.create({requiredUsername: executors.generateRequiredUsername(10)})
        const user = await User.findByPk(decoded.id)
        await user.addVerifyExecutorTicket(ticket)
        return res.json({message: "real cringe, but all is ok " + ticket.id})
    }

    async verifyExecutor(req, res, next){
        const {ticketId} = req.body
        if (!ticketId){
            return next(ApiError.badRequest("wrong input format"))
        }
        const ticket = await VerifyExecutorTicket.findByPk(ticketId)
        if (!ticket){
            return next(ApiError.badRequest('ticket not found'))
        }

        ticket.closed = true;
        await ticket.save()
        executors.createExecutor(ticket.userId)
        return res.json({message: 'executor verified'})
    }
}

module.exports = new ExecutorTicketController()