const jwt = require("jsonwebtoken");
const ApiError = require("../errors/api-error");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = userData;
    next();
  } catch (e) {
    next(ApiError.UnauthorizedError());
  }
};
