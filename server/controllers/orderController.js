const ApiError = require("../errors/ApiError")
const {Order, User} = require('../models/models')


class OrderController {
    async createOrder(req, res, next){
        try {
            const { creatorId } = req.body
            const order = await Order.create({})
            const user = await User.findByPk(creatorId)
            order.setUser(user)
            return res.json({message: "order was created"})
        }
        catch (e) {
            console.log(e)
            return next(ApiError.internal("unexpected error"))
        }
    }

    async removeOrder(req, res, next){

    }

    async getOne(req, res, next){
        const {id} = req.params
        console.log(id)
        const order = await Order.findByPk(id)
        return res.json(order)
    }

    async getAll(req, res, next){
        const {creatorId} = req.query
        let orders;

        if (!creatorId){
            orders = await Order.findAll()
        }
        if (creatorId){
            orders = await Order.findAll({where: {userId: creatorId}})
        }
        return res.json(orders)
    }
}

module.exports = new OrderController()