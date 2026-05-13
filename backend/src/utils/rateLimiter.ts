import rateLimit from 'express-rate-limit'

export const apiRequestsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Превышено максимальное число запросов. Пожалуйста, попробуйте позже.'
    }
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Превышено максимальное число попыток входа. Пожалуйста, попробуйте через 15 минут.'
    }
})
