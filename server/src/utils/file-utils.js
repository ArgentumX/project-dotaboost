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

    readBlacklist() {
        try {
            const filePath = path.resolve(__dirname, "..", "blacklist.txt");
            const content = fs
                .readFileSync(filePath, "utf8")
                .replaceAll("\r", "")
                .split("\n")
                .filter((item) => item !== "");
            return content;
        } catch (error) {
            console.error("Reading file error:", error);
            return [];
        }
    }

    async saveBlacklist(blacklist) {
        const filePath = path.resolve(__dirname, "..", "blacklist.txt");
        fs.truncateSync(filePath, 0);
        for (let i = 0; i < blacklist.length; i++) {
            fs.appendFile(filePath, `${blacklist[i]}\n`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
}

module.exports = new Files();
