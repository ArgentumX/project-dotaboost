const Router = require('express')
const router = new Router()
const executorTicketController = require('../controllers/executorTicketController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator')

router.post('/create', authMiddleware, executorTicketController.createTicket)
router.post('/screen', authMiddleware, executorTicketController.uploadScreen)

module.exports = router