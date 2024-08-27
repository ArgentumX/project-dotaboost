const config = require("../config");

class PriceCalculator {
    // Send only validated data;
    getOrderPrice(order) {
        const { party, priority, steamGuard, playTime, startRating, endRating } = order;
        let price = 0;

        price += this.integrate(startRating, endRating, config.PRICES.ORDER.INTEGRAL_COEFFICIENTS);
        price *= party ? config.PRICES.ORDER.PARTY_MULTIPLIER : 1.0;
        price *= priority ? config.PRICES.ORDER.PRIORITY_MULTIPLIER : 1.0;
        price *= steamGuard ? config.PRICES.ORDER.STEAM_GUARD_MULTIPLIER : 1.0;
        price *= playTime != null ? config.PRICES.ORDER.PLAY_TIME_MULTIPLIER : 1.0;

        return Math.ceil(price);
    }

    integrate(x1, x2, coefficients) {
        return this.f(x2, coefficients) - this.f(x1, coefficients);
    }

    f(x, coefficients) {
        let result = 0;
        for (let i = 0; i < coefficients.length; i++) {
            result += coefficients[i] * x ** (coefficients.length - 1 - i);
        }
        return result;
    }
}
module.exports = new PriceCalculator();
