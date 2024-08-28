const Router = require("express");
const router = new Router();
const batchController = require("../controllers/batch-controller.js");
const authMiddleware = require("../middleware/auth-middleware");
const { body, query, param } = require("express-validator");
const config = require("../config");
const { isNonNegative } = require("../utils/validation-utils");
const imageUploadMiddleware = require("../middleware/image-upload-middleware");

router.post(
    "/",
    authMiddleware,
    body("isWin").isBoolean(),
    body(["receivedMMR", "orderId"]).isNumeric(),
    imageUploadMiddleware(config.MAX_MB_SCREEN_FILESIZE),
    batchController.createBatch
);
router.post(
    "/screen",
    authMiddleware,
    body("batchId").isNumeric(),
    imageUploadMiddleware(config.MAX_MB_SCREEN_FILESIZE),
    batchController.loadScreen
);

router.get("/:id", param("id").isNumeric(), batchController.getBatch);
router.get(
    "/",
    query(["executorId", "orderId", "offset"])
        .optional({ values: null })
        .isNumeric()
        .custom(isNonNegative),
    batchController.getBatches
);
module.exports = router;
