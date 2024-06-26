import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

export const sensitiveLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too many requests, please try again later."
});
