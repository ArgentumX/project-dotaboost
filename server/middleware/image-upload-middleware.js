const ApiError = require("../errors/api-error");
const { ExpressFileuploadValidator } = require("express-fileupload-validator");
const config = require("../config");

const imageValidator = new ExpressFileuploadValidator({
  minCount: 1,
  maxCount: 1,
  allowedExtensions: ["jpg", "png", "jpeg"],
  allowedMimetypes: ["image/jpg", "image/jpeg", "image/png"],
  maxSize: `${config.MAX_MB_FILESIZE}MB`,
});

module.exports = (req, res, next) => {
  try {
    const image = req.files.image;
    if (!image) {
      return next(ApiError.BadRequest("file not found"));
    }
    imageValidator.validate(image);
    next();
  } catch (e) {
    return next(ApiError.BadRequest("wrong file size or extension"));
  }
};
