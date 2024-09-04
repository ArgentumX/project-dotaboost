const ApiError = require("../errors/api-error");
const { Order, User, Executor, Role, UserRole } = require("../models/models");
const config = require("../config");
const Uuid = require("uuid");
const path = require("path");
const fs = require("fs");

class Files {
    createStaticImage(imageFile, prefix) {
        const imageName = `${prefix + Uuid.v4()}.jpg`;
        imageFile.mv(path.resolve(__dirname, "..", "public/images", imageName));
        return imageName;
    }

    async deleteStaticImage(imageName) {
        const filePath = path.resolve(__dirname, "..", "public/images", imageName);
        fs.unlink(filePath, (e) => {
            if (e) {
                console.error(e);
            }
        });
    }
}

module.exports = new Files();
