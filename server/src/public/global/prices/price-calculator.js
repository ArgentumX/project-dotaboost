const config = require("../config");

function isSpecificPlayTime(playTime) {
    for (const key of config.ORDER.PLAY_TIME_KEYS) {
        if (!playTime[key]) {
            return true;
        }
    }
    return false;
}
class RatingPriceMap {
    ratingPriceList;
    constructor(rawPriceMap) {
        this.ratingPriceList = [];

        for (const key of Object.keys(rawPriceMap)) {
            const splitted = key.split("-");
            const a = splitted[0];
            const b = splitted[1];
            const element = { start: a, end: b, price: rawPriceMap[key] };
            this.ratingPriceList.push(element);
        }
    }

    getTotalPrice(startRating, endRating) {
        let result = 0;
        let startSector;
        let endSector;
        for (let i = 0; i < this.ratingPriceList.length; i++) {
            if (startRating <= this.ratingPriceList[i].end) {
                startSector = i;
                break;
            }
        }
        for (let i = startSector; i < this.ratingPriceList.length; i++) {
            if (endRating <= this.ratingPriceList[i].end) {
                endSector = i;
                break;
            }
        }

        if (startSector === endSector) {
            result = (endRating - startRating) * this.ratingPriceList[startSector].price;
        } else {
            result +=
                (this.ratingPriceList[startSector].end - startRating) *
                this.ratingPriceList[startSector].price;
            result +=
                (endRating - this.ratingPriceList[endSector].start) *
                this.ratingPriceList[endSector].price;
            for (let i = startSector + 1; i < endSector; i++) {
                result +=
                    (this.ratingPriceList[i].end - this.ratingPriceList[i].start) *
                    this.ratingPriceList[i].price;
            }
        }
        return result;
    }
}
class PriceCalculator {
    ratingPriceMap = new RatingPriceMap(config.ORDER.PRICES.RATING_PRICE_MAP);

    // Send only validated data and use try/catch protection.
    getOrderPrice(order) {
        const { party, priority, steamGuard, playTime, startRating, endRating } = order;
        let price = 0;

        price += this.ratingPriceMap.getTotalPrice(startRating, endRating);
        price *= party ? config.ORDER.PRICES.PARTY_MULTIPLIER : 1.0;
        price *= priority ? config.ORDER.PRICES.PRIORITY_MULTIPLIER : 1.0;
        price *= steamGuard ? config.ORDER.PRICES.STEAM_GUARD_MULTIPLIER : 1.0;
        price *= isSpecificPlayTime(playTime) ? config.ORDER.PRICES.PLAY_TIME_MULTIPLIER : 1.0;

        return Math.ceil(price);
    }
}
module.exports.PriceCalculator = new PriceCalculator();
