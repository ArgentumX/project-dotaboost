const Router = require("express");
const router = new Router();
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, query, param } = require("express-validator");
const checkRoleMiddleware = require("../middleware/check-role-middleware");
const config = require("../config");
const { isNonNegative } = require("../utils/validation-utils");
const userController = require("../controllers/user-controller");

router.get("/:chatId", authMiddleware, param("chatId").isNumeric(), userController.getChat);
router.get(
    "/:chatId/messages",
    authMiddleware,
    param("chatId").isNumeric(),
    query("offset").isNumeric().custom(isNonNegative),
    userController.getChatMessages
);
router.post(
    "/:chatId",
    authMiddleware,
    param("chatId").isNumeric(),
    body("text").isString(),
    userController.sendMessage
);

module.exports = router;
