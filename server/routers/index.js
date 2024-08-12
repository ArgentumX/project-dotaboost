const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const orderRouter = require('./orderRouter')
const adminRouter = require('./adminRouter')
const executorTicketRouter = require('./executorTicketRouter')


router.use('/user', userRouter)
router.use('/order', orderRouter)
router.use('/admin', adminRouter)
router.use('/executorTicket', executorTicketRouter)

module.exports = router