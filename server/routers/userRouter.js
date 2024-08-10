const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const { body } = require('express-validator')


router.post('/registration', body('email').isEmail(), userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/info', authMiddleware, userController.getCurrentUser)
router.post('/avatar', authMiddleware, userController.uploadAvatar) 

module.exports = router