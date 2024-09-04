const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth-middleware");
const { body, param } = require("express-validator");
const config = require("../config");
const executorController = require("../controllers/executor-controller");
const userController = require("../controllers/user-controller");

router.post(
    "/rate",
    authMiddleware,
    body("executorId").isNumeric(),
    body("isLike").isBoolean(),
    executorController.addRate
);
router.post(
    "/disrate",
    authMiddleware,
    body("executorId").isNumeric(),
    executorController.removeRate
);
router.get(
    "/rates",
    body("executorId").isNumeric(),
    body("userId").optional({ values: null }).isNumeric(),
    executorController.getRates
);
router.post(
    "/comments",
    authMiddleware,
    body("executorId").isNumeric(),
    body("text").isString(),
    executorController.createComment
);
router.get(
    "/comments/:executorId",
    param("executorId").isNumeric(),
    executorController.getComments
);

router.delete(
    "/comments/:commentId",
    authMiddleware,
    param("commentId").isNumeric(),
    executorController.removeComment
);

module.exports = router;
