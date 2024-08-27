const config = require("../config");

function integrate(x1, x2, coefficients) {
    return f(x2, coefficients) - f(x1, coefficients);
}

function f(x, coefficients) {
    let result = 0;
    for (let i = 0; i < coefficients.length; i++) {
        result += coefficients[i] * x ** (coefficients.length - 1 - i);
    }
    return result;
}

function isSpecificPlayTime(playTime) {
    for (const key of config.ORDER.PLAY_TIME_KEYS) {
        if (!playTime[key]) {
            return true;
        }
    }
    return false;
}
class PriceCalculator {
    // Send only validated data and use try/catch protection.
    getOrderPrice(order) {
        const { party, priority, steamGuard, playTime, startRating, endRating } = order;
        let price = 0;

        price += integrate(startRating, endRating, config.ORDER.PRICES.INTEGRAL_COEFFICIENTS);
        price *= party ? config.ORDER.PRICES.PARTY_MULTIPLIER : 1.0;
        price *= priority ? config.ORDER.PRICES.PRIORITY_MULTIPLIER : 1.0;
        price *= steamGuard ? config.ORDER.PRICES.STEAM_GUARD_MULTIPLIER : 1.0;
        price *= isSpecificPlayTime(playTime) ? config.ORDER.PRICES.PLAY_TIME_MULTIPLIER : 1.0;

        return Math.ceil(price);
    }
}
module.exports = new PriceCalculator();
