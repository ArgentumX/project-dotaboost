module.exports = {
  ROLES: {
    user: { title: "USER", display: false },
    admin: { title: "ADMIN", display: false },
    executor: { title: "EXECUTOR", display: true },
    god: { title: "GOD", display: false },
  },
  TEST: {
    ANSWERS: "1488",
    REQUIRED_POINTS: 4,
  },
  AVATAR_FILE_PREFIX: "AVATAR_",
  SCREEN_FILE_PREFIX: "SCREEN_",
  REFRESH_TOKEN_DAY_LIFETIME: 30,
  ACCESS_TOKEN_MIN_LIFETIME: 18000,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 32,
  USERNAME_MIN_LENGTH: 4,
  USERNAME_MAX_LENGTH: 16,
  MAX_MB_FILESIZE: 1,
};
