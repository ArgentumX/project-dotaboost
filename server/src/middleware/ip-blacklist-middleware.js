const jwt = require("jsonwebtoken");
const ApiError = require("../errors/api-error");
const config = require("../config");
const requestIp = require("request-ip");
const fileUtils = require("../utils/file-utils");
const ipUtils = require("ip-matching");

let _blacklist = [];
function customInclude(array, element, func) {
    for (let i = 0; i < array.length; i++) {
        if (func(array[i], element)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    async IpBlacklistMiddleware(req, res, next) {
        try {
            const ip = requestIp.getClientIp(req);
            if (customInclude(_blacklist, ip, ipUtils.matches)) {
                return res.end();
            }
            next();
        } catch (e) {
            return res.end();
        }
    },

    async loadBlacklistData() {
        _blacklist = fileUtils.readBlacklist();
    },

    async addBlacklistIp(ip) {
        _blacklist.push(ip);
        fileUtils.saveBlacklist(_blacklist);
    },

    async removeBlacklistIp(ip) {
        _blacklist = _blacklist.filter((val) => val !== ip);
        fileUtils.saveBlacklist(_blacklist);
    },

    getBlackList() {
        return _blacklist;
    },
};
