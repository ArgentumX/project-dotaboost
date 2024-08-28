const Router = require("express");
const router = new Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body, param } = require("express-validator");
const config = require("../config");
const imageUploadMiddleware = require("../middleware/image-upload-middleware");
const executorRateController = require("../controllers/executor-rate-controller");

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({
        min: config.PASSWORD_MIN_LENGTH,
        max: config.PASSWORD_MAX_LENGTH,
    }),
    body("username").isLength({
        min: config.USERNAME_MIN_LENGTH,
        max: config.USERNAME_MAX_LENGTH,
    }),
    userController.registration
);

router.post(
    "/change-password",
    authMiddleware,
    body("newPassword").isLength({
        min: config.USERNAME_MIN_LENGTH,
        max: config.USERNAME_MAX_LENGTH,
    }),
    userController.changePassword
);

router.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({
        min: config.PASSWORD_MIN_LENGTH,
        max: config.PASSWORD_MAX_LENGTH,
    }),
    userController.login
);

router.post("/logout", authMiddleware, userController.logout);

router.post("/avatar", authMiddleware, imageUploadMiddleware(), userController.uploadAvatar);

router.get("/activate/:link", userController.activate);

router.get("/refresh", userController.refresh);

router.post("/send-recover-mail", body("email").isEmail(), userController.sendRecoverMail);

router.post(
    "/recover-access",
    body("recoverToken").isString(),
    body("newPassword").isLength({
        min: config.PASSWORD_MIN_LENGTH,
        max: config.PASSWORD_MAX_LENGTH,
    }),
    userController.recoverAccess
);

router.post(
    "/comment-executor",
    authMiddleware,
    body("executorId").isNumeric(),
    body("text").isString(),
    userController.postExecutorComment
);

router.get(
    "/comment-executor/:executorId",
    param("executorId").isNumeric(),
    userController.getExecutorComments
);

router.get("/executor", body("userId").isNumeric(), userController.getExecutorByUserId);

router.get("/:id", param("id").isNumeric(), userController.getUser);

module.exports = router;
