const Router = require("express");
const router = new Router();
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middleware/auth-middleware");
const { body } = require("express-validator");
const executorTicketController = require("../controllers/executor-ticket-controller");
const checkRoleMiddleware = require("../middleware/check-role-middleware");
const config = require("../config");

router.post(
  "/verify",
  authMiddleware,
  checkRoleMiddleware(config.ROLES.admin.title),
  adminController.approveDotaAccount
);
// TODO rework
router.post(
  "/force-verify",
  authMiddleware,
  checkRoleMiddleware(config.ROLES.admin.title),
  executorTicketController.verifyExecutor
);

module.exports = router;
