const Router = require("express");
const router = new Router();
const orderController = require("../controllers/order-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, query, param } = require("express-validator");
const config = require("../config");
const { isNonNegative } = require("../utils/validation-utils");

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

router.post(
    "/",
    authMiddleware,
    body(["party", "priority", "steamGuard"]).optional({ values: null }).isBoolean(),
    body(["steamUsername", "steamPassword"]).isString(),
    body("playTime").optional({ values: null }).isObject().custom(playTimeValidation),
    body(["startRating", "endRating"]).isNumeric(),
    orderController.createOrder
);
router.get(
    "/record",
    query(["executorId", "orderId"]).optional({ values: null }).isNumeric(),
    query("offset").optional({ values: null }).isNumeric().custom(isNonNegative),
    query("recordType").optional({ values: null }).isIn(Object.values(config.RECORDS.TYPE)),
    orderController.getOrderRecords
);
router.get("/:id", param("id").isNumeric(), orderController.getOrder); // Returns order by id.
router.post("/:id/take", authMiddleware, param("id").isNumeric(), orderController.takeOrder);
router.post("/refuse", authMiddleware, orderController.refuseOrder);

router.get(
    "/",
    query(["party", "priority", "steamGuard", "closed"]).optional({ values: null }).isBoolean(),
    query("playTime").optional({ values: null }).isObject().custom(playTimeValidation),
    query(["startRating", "endRating"]).optional({ values: null }).isNumeric(),
    query(["userId", "offset"]).optional({ values: null }).isNumeric().custom(isNonNegative),
    orderController.getOrders
); // Returns all orders. May be filtered by creatorId (.../order/?creatorId=123).

module.exports = router;
