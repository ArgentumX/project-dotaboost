const Router = require("express");
const router = new Router();
const orderController = require("../controllers/order-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, query, param } = require("express-validator");
const config = require("../config");

function playTimeValidation(playTime) {
    const requiredKeys = config.PLAY_TIME_KEYS;
    const keys = Object.keys(playTime);
    if (requiredKeys.length !== keys.length) {
        throw new Error("playTime validation error");
    }
    for (const key of requiredKeys) {
        if (!(key in playTime) || typeof playTime[key] !== "boolean") {
            throw new Error("playTime validation error");
        }
    }
    return true;
}

router.post(
    "/",
    authMiddleware,
    body(["party", "priority", "steamGuard"]).optional({ values: null }).isBoolean(),
    body(["steamUsername", "steamPassword"]).isString(),
    body("playTime").optional({ values: null }).isObject().custom(playTimeValidation),
    orderController.createOrder
);
router.get("/:id", param("id").isNumeric(), orderController.getOrder); // Returns order by id.
router.get(
    "/",
    query("creatorId").optional({ values: null }).isNumeric(),
    orderController.getOrders
); // Returns all orders. May be filtered by creatorId (.../order/?creatorId=123).

module.exports = router;
