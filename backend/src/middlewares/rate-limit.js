const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas de login. Aguarde 1 minuto e tente novamente.",
  },
});

const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas requisições. Aguarde um momento.",
  },
});

module.exports = { authRateLimiter, generalRateLimiter };
