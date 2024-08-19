const Router = require("express");
const router = new Router();
const orderController = require("../controllers/order-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, query, param } = require("express-validator");
const config = require("../config");

function playTimeValidation(playTime) {
    const requiredKeys = config.PLAY_TIME_KEYS;
    if (requiredKeys.length !== Object.keys(playTime).length) {
        throw new Error("playTime validation error");
    }
    for (const key of requiredKeys) {
        if (!(key in playTime) || typeof playTime[key] !== "boolean") {
            throw new Error("playTime validation error");
        }
    }
    return true;
}

function isNonNegative(num) {
    if (num < 0) {
        throw new Error("offset must be positive");
    }
    return true;
}

router.post(
    "/",
    authMiddleware,
    body(["party", "priority", "steamGuard"]).optional({ values: null }).isBoolean(),
    body(["steamUsername", "steamPassword"]).isString(),
    body("playTime").optional({ values: null }).isObject().custom(playTimeValidation),
    body(["startRating", "endRating"]).isNumeric(),
    orderController.createOrder
);
router.get("/:id", param("id").isNumeric(), orderController.getOrder); // Returns order by id.
router.get(
    "/",
    query(["party", "priority", "steamGuard"]).optional({ values: null }).isBoolean(),
    query("playTime").optional({ values: null }).isObject().custom(playTimeValidation),
    query(["startRating", "endRating"]).optional({ values: null }).isNumeric(),
    query(["creatorId", "offset"]).optional({ values: null }).isNumeric().custom(isNonNegative),
    orderController.getOrders
); // Returns all orders. May be filtered by creatorId (.../order/?creatorId=123).

module.exports = router;
