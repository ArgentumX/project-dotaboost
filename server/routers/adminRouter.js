const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator')
const executorTicketController = require('../controllers/executorTicketController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const config = require('../config')

router.post('/verify', authMiddleware, checkRoleMiddleware(config.ROLES.admin.title), adminController.approveDotaAccount)
// rewrite
router.post('/force-verify', authMiddleware, checkRoleMiddleware(config.ROLES.admin.title), executorTicketController.verifyExecutor)

module.exports = router