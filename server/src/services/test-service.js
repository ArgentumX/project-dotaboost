const ApiError = require("../errors/api-error");
const config = require("../config");

class TestService {
    isTestPassed(answers) {
        return this.getTestPoints(answers) >= config.TEST.REQUIRED_POINTS;
    }
    getTestPoints(answers) {
        let points = 0;
        const rightAnswers = config.TEST.ANSWERS;
        for (const key in rightAnswers) {
            if (answers.hasOwnProperty(key) && answers[key] === rightAnswers[key]) {
                points++;
            }
        }
        return points;
    }
}

module.exports = new TestService();
