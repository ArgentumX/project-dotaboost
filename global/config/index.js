module.exports = {
    ORDER: {
        PRICES: {
            PARTY_MULTIPLIER: 1.5,
            PRIORITY_MULTIPLIER: 1.3,
            STEAM_GUARD_MULTIPLIER: 1.0,
            PLAY_TIME_MULTIPLIER: 1.2,
            // ax^n + bx^(n-1) + ... + cx + d
            INTEGRAL_COEFFICIENTS: [0.000000000011, -0.000000063, 0.00018, 0.94, 0],
        },
        PLAY_TIME_KEYS: ["MORNING", "NIGHT", "AFTERNOON", "EVENING"],
    },
};
