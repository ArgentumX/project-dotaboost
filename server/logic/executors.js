const ApiError = require("../errors/ApiError")
const {Order, User, Executor, Role, UserRole} = require('../models/models')
const config = require("../config")
const roles = require('./roles')

class Executors {
    // rewrite (try / catch protection)
    async createExecutor(userId){
        const user = await User.findByPk(userId)
        const executor = await Executor.create({})
        await user.setExecutor(executor)
        await roles.addUserRole(user, config.ROLES.executor.title)
    }

    generateRequiredUsername(length) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (var i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * alphabet.length);
            result += alphabet[randomIndex];
        }
        return result;
    }

    // answers example: "123131323244"
    getTestPoints(answers){
        let points = 0
        let rightAnswers = config.TEST.ANSWERS
        for (let i = 0; i < rightAnswers.length; i++){
            if (rightAnswers[i] === answers[i]){
                points += 1
            }
        }
        return points
    }
}

module.exports = new Executors()
