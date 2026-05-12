import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import ForbiddenError from '../errors/forbidden-error'

export const CSRF_COOKIE = '_csrf'
export const CSRF_HEADER = 'x-csrf-token'
export const CSRF_APPLIED_METHODS = ['DELETE', 'POST', 'PUT', 'UPDATE']

export const generateCsrfToken = (length: number = 32): string => {
    if (length <= 0) {
        throw new Error('Длина CSRF-токена должна быть положительным числом')
    }
    const byteLength = Math.floor(length)
    return crypto.randomBytes(byteLength).toString('hex')
}

export const setCsrfCookie = (res: Response, csrfToken: string) => {
    res.cookie(CSRF_COOKIE, csrfToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        path: '/',
    })
}

export const csrfProtection = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (!CSRF_APPLIED_METHODS.includes(req.method)) {
        return next()
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE]
    const requestToken =
        req.get(CSRF_HEADER) ||
        req.get('csrf-token') ||
        req.get('x-xsrf-token')

    if (!cookieToken || !requestToken || cookieToken !== requestToken) {
        return next(new ForbiddenError('Невалидный CSRF-токен'))
    }

    return next()
}
