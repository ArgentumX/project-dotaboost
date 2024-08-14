const ApiError = require("../errors/ApiError")
const {VerifyExecutorTicket, User} = require('../models/models')
const users = require('../logic/users')
const executors = require('../logic/executors')
const { json } = require("sequelize")
const config = require("../config")
const files = require("../logic/files")

class ExecutorTicketController {
    async createTicket(req, res, next){

        const {answers} = req.body
        if (!answers){
            return next(ApiError.badRequest("no answers obj"))
        }
        const decoded = req.user
        const user = await User.findByPk(decoded.id)
        if (!user){
            return next(ApiError.badRequest("user not found"))
        }
        let openTicket = await VerifyExecutorTicket.findOne({where: {userId : decoded.id, closed: false}})
        if (openTicket){
            return next(ApiError.badRequest("user already has opened ticket"))
        }
        let passedTest = executors.getTestPoints(answers) >= config.TEST.REQUIRED_POINTS
        if (!passedTest){
            return res.json({message: "test not passed"})
        }
        const ticket = await VerifyExecutorTicket.create({requiredUsername: executors.generateRequiredUsername(10), passedTest: passedTest})
        await user.addVerifyExecutorTicket(ticket)
        return res.json({message: "ticket was created", ticket})
    }

    async uploadScreen(req, res, next){
        try{
            const image = req.files.file
            if (!image){
                return next(ApiError.badRequest("wrong input format"))
            }
            const decoded = req.user
            const ticket = VerifyExecutorTicket.findOne({where: {userId: decoded.id, closed: false}})
            if (!ticket){
                return next(ApiError.badRequest("open ticket not found"))
            }
            ticket.image = files.createStaticImage(image, config.SCREEN_FILE_PREFIX)
            return res.json({message: "screen was uploaded"})
        
        }
        catch (e){
            console.log(e)
            return res.status(400).json({message:"upload avatar error"})
        }
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