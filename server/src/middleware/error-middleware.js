const ApiError = require("../errors/api-error");

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors.errors });
    }
    console.log(err);
    return res.status(500).json({ message: "unexpected error" });
};
