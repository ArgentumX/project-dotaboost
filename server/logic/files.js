const ApiError = require("../errors/ApiError")
const {Order, User, Executor, Role, UserRole} = require('../models/models')
const config = require("../config")
const Uuid = require("uuid")
const path = require("path")

class Files {
    createStaticImage(imageFile, prefix){
        let imageName = prefix + Uuid.v4() + ".jpg"
        imageFile.mv(path.resolve(__dirname, '..', 'static', imageName))
        return imageName
    }
}

module.exports = new Files()
