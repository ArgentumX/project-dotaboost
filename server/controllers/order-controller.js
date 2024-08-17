const ApiError = require("../errors/api-error");
const { Order, User } = require("../models/models");

class OrderController {
  // rework
  async createOrder(req, res, next) {
    const {
      party,
      priority,
      steamGuard,
      playTime,
      steamUsername,
      steamPassword,
    } = req.body;
    const decoded = req.user;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(ApiError.badRequest("user not found"));
    }

    const hasNoPaidOrder = await Order.findOne({
      where: { paid: false, userId: decoded.id },
    });
    if (hasNoPaidOrder) {
      return next(
        ApiError.badRequest(
          "unable to create new orders before other not paided"
        )
      );
    }
    const order = await Order.create({
      party,
      priority,
      steamGuard,
      playTime,
      steamUsername,
      steamPassword,
    });
    await order.setUser(user);
    return res.json({ message: "order was created" });
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("wrong input format"));
    }
    const order = await Order.findByPk(id);
    if (!order) {
      return next(ApiError.badRequest("order not found"));
    }
    return res.json(order);
  }

  async getAll(req, res, next) {
    const { creatorId } = req.query;
    let orders;

    if (!creatorId) {
      orders = await Order.findAll();
    }
    if (creatorId) {
      orders = await Order.findAll({ where: { userId: creatorId } });
    }
    return res.json(orders);
  }
}

module.exports = new OrderController();
