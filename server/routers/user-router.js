const Router = require("express");
const router = new Router();
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body } = require("express-validator");
const config = require("../config");
const imageUploadMiddleware = require("../middleware/image-upload-middleware");

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

module.exports = router;
