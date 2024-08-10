const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, orderController.createOrder)
router.get('/:id', orderController.getOne) // Returns order by id.
router.get('/', orderController.getAll) // Returns all orders. May be filtered by creatorId (.../order/?creatorId=123).

module.exports = router