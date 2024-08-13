const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator')
const executorTicketController = require('../controllers/executorTicketController')

router.post('/verify', authMiddleware, adminController.approveDotaAccount)
// rewrite
router.post('/force-verify', authMiddleware, executorTicketController.verifyExecutor)

module.exports = router