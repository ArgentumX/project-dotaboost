const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth-middleware");
const { body, param } = require("express-validator");
const config = require("../config");
const executorRateController = require("../controllers/executor-rate-controller");

router.post(
    "/rate",
    authMiddleware,
    body("executorId").isNumeric(),
    body("isLike").isBoolean(),
    executorRateController.addRate
);
router.post(
    "/disrate",
    authMiddleware,
    body("executorId").isNumeric(),
    executorRateController.removeRate
);
router.get(
    "/rates",
    body("executorId").isNumeric(),
    body("userId").optional({ values: null }).isNumeric(),
    executorRateController.getRates
);

module.exports = router;
