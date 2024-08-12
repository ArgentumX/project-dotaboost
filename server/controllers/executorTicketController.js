const ApiError = require("../errors/ApiError")
const {VerifyExecutorTicket, User} = require('../models/models')
const userController = require('./userController')

class ExecutorTicketController {
    //Needs to be reworked later (add more try catch and other security stuff)
    async createTicket(req, res, next){

        const decoded = userController.getAuthUserJWTData(req, res, next)
        const ticket = await VerifyExecutorTicket.create({})
        const user = await User.findByPk(decoded.id)
        await ticket.setUser(user)
        return res.json({message: "real cringe, but all is ok " + ticket.id})
    }
}

module.exports = new ExecutorTicketController()