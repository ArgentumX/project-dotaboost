const Router = require("express");
const router = new Router();
const executorTicketController = require("../controllers/executor-ticket-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, param } = require("express-validator");
const config = require("../config");
const imageUploadMiddleware = require("../middleware/image-upload-middleware");
const { isNonNegative } = require("../utils/validation-utils");

function answersValidation(answers) {
    const rightKeys = Object.keys(config.TEST.ANSWERS);
    if (rightKeys.length !== Object.keys(answers).length) {
        throw new Error("answers validation error1");
    }
    for (const key of rightKeys) {
        if (!(key in answers) || typeof answers[key] !== "string") {
            throw new Error("answers validation error2");
        }
    }
    return true;
}

router.post(
    "/create",
    authMiddleware,
    body("answers").isObject().custom(answersValidation),
    executorTicketController.createTicket
);
router.post(
    "/screen",
    authMiddleware,
    imageUploadMiddleware(config.MAX_MB_SCREEN_FILESIZE),
    executorTicketController.uploadScreen
);
router.get(
    "/:id",
    authMiddleware,
    param("id").isNumeric(),
    executorTicketController.getExecutorTicket
);

module.exports = router;
