const Router = require('express')
const router = new Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator')

router.post('/verify', authMiddleware, adminController.verifyExecutor)

module.exports = router