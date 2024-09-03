const Router = require("express");
const router = new Router();
const userRouter = require("./user-router");
const orderRouter = require("./order-router");
const adminRouter = require("./admin-router");
const executorRouter = require("./executor-router");
const executorTicketRouter = require("./executor-ticket-router");
const batchRouter = require("./batch-router");
const chatRouter = require("./chat-router");

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/admin", adminRouter);
router.use("/executor-ticket", executorTicketRouter);
router.use("/executor", executorRouter);
router.use("/batch", batchRouter);
router.use("/chat", chatRouter);

module.exports = router;
