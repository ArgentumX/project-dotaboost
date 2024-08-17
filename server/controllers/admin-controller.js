const ApiError = require("../errors/api-error")
const {VerifyExecutorTicket} = require('../models/models')

class AdminController {

    async approveDotaAccount(req, res, next){
        const { ticketId, success} = req.body
        if (!ticketId){
            return next(ApiError.badRequest("wrong input format"))
        }
        
        const ticket = await VerifyExecutorTicket.findByPk(ticketId)
        if (!ticket){
            return next(ApiError.badRequest("ticket not found"))
        }
        
        if (success) {
            ticket.verified = true;
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