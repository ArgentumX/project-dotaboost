function isNonNegative(num) {
    if (num < 0) {
        throw new Error("offset must be positive");
    }
    return true;
}
module.exports = { isNonNegative };
