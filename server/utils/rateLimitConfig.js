const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 500, // 500ms
    max: 1, // Limit to 1 requests per 'windowMs' (0.5 sec)
    message: { msg: "Too many login attempts, please try again after a minute"},
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = rateLimit(limiter);