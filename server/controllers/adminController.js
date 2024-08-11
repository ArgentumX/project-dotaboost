const ApiError = require("../errors/ApiError")
const {VerifyExecutorTicket} = require('../models/models')

class AdminController {

    async verifyExecutor(req, res, next){
        const { verifyExecutorTicketId, success} = req.body
        if (!verifyExecutorTicketId){
            return next(ApiError.badRequest("wrong input format"))
        }
        
        const ticket = await VerifyExecutorTicket.findByPk(verifyExecutorTicketId)
        if (!ticket){
            return next(ApiError.badRequest("ticket not found"))
        }
        
        if (success) {
            ticket.verificated = true;
            await ticket.save()
            return res.json({message: "successfully verificated"})
        }
        else {
            ticket.closed = true;
            await ticket.save()
            return res.json({message: "successfully rejected"})
        }
    }
}

module.exports = new AdminController()