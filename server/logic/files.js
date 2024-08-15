const ApiError = require("../errors/ApiError")
const {Order, User, Executor, Role, UserRole} = require('../models/models')
const config = require("../config")
const Uuid = require("uuid")
const path = require("path")
const fs = require('fs')

class Files {
    createStaticImage(imageFile, prefix){
        let imageName = prefix + Uuid.v4() + ".jpg"
        imageFile.mv(path.resolve(__dirname, '..', 'static', imageName))
        return imageName
    }

    async deleteStaticImage(imageName){
        fs.unlink(path.resolve(__dirname, '..', 'static', imageName), err => {
        if (err) {
            console.error(`An error occurred ${err.message}`)
        }})
    }
}

module.exports = new Files()
