const Router = require("express");
const router = new Router();
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, query, param } = require("express-validator");
const checkRoleMiddleware = require("../middleware/check-role-middleware");
const config = require("../config");
const { isNonNegative } = require("../utils/validation-utils");

router.post(
    "/verify",
    authMiddleware,
    checkRoleMiddleware(config.ROLES.LIST.admin.title),
    body("ticketId").isNumeric(),
    body("success").isBoolean(),
    adminController.verifyExecutorInfo
);

router.get(
    "/executor-ticket/",
    authMiddleware,
    checkRoleMiddleware(config.ROLES.LIST.admin.title),
    query(["closed", "verified"]).optional({ values: null }).isBoolean(),
    query(["userId", "offset"]).optional({ values: null }).isNumeric().custom(isNonNegative),
    adminController.getExecutorTickets
);
router.get(
    "/executor-ticket/:id",
    authMiddleware,
    checkRoleMiddleware(config.ROLES.LIST.admin.title),
    param("id").isNumeric(),
    adminController.getExecutorTicket
);

router.delete(
    "/order/:orderId",
    authMiddleware,
    checkRoleMiddleware(config.ROLES.LIST.admin.title),
    param("orderId").isNumeric(),
    adminController.removeOrder
);
router.patch(
    "/order/:orderId/close",
    authMiddleware,
    checkRoleMiddleware(config.ROLES.LIST.admin.title),
    param("orderId").isNumeric(),
    adminController.closeOrder
);

module.exports = router;
