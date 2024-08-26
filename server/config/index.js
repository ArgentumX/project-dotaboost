module.exports = {
    ROLES: {
        LIST: {
            user: { title: "USER", display: false },
            admin: { title: "ADMIN", display: false },
            executor: { title: "EXECUTOR", display: true },
            god: { title: "GOD", display: false },
        },
        DEFAULT_ROLE_ID: "USER",
    },
    TEST: {
        ANSWERS: { 1: "ans1", 2: "ans2", 3: "ans3", 4: "ans4", 5: "ans5" },
        REQUIRED_POINTS: 5,
    },
    TOKENS: {
        TYPE: {
            REFRESH: "REFRESH",
            RECOVER: "RECOVER",
        },
    },
    MESSAGES: {
        USER_NOT_FOUND: "User not found",
    },
    AVATAR_FILE_PREFIX: "AVATAR_",
    SCREEN_FILE_PREFIX: "SCREEN_",
    REFRESH_TOKEN_DAY_LIFETIME: 30,
    ACCESS_TOKEN_MIN_LIFETIME: 18000,
    RECOVER_TOKEN_MIN_LIFETIME: 5,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 32,
    USERNAME_MIN_LENGTH: 4,
    USERNAME_MAX_LENGTH: 16,
    MAX_MB_AVATAR_FILESIZE: 1,
    MAX_MB_SCREEN_FILESIZE: 4,
    PLAY_TIME_KEYS: ["MORNING", "NIGHT", "AFTERNOON", "EVENING"],
    ALLOWED_ORDER_FILTERS: ["userId", "closed", "steamGuard", "party", "priority"],
    ALLOWED_TICKET_FILTERS: ["userId", "closed", "verified"],
    ALLOWED_BATCH_FILTERS: ["executorId", "orderId"],
    DB_TICKET_SEARCH_LIMIT: 2,
    DB_ORDER_SEARCH_LIMIT: 2,
    DB_BATCH_SEARCH_LIMIT: 2,
};
