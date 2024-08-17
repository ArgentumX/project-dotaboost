const Router = require("express");
const router = new Router();
const userRouter = require("./user-router");
const orderRouter = require("./order-router");
const adminRouter = require("./admin-router");
const executorTicketRouter = require("./executor-ticket-router");

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/admin", adminRouter);
router.use("/executor-ticket", executorTicketRouter);

module.exports = router;
