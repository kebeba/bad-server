import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS, ORIGIN_ALLOW } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import { csrfProtection } from './middlewares/csrf-protector'
import routes from './routes'
import { apiRequestsLimiter, authLimiter } from './utils/rateLimiter'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())
app.use('/auth/login', authLimiter)
app.use('/product', apiRequestsLimiter)
app.use('/order', apiRequestsLimiter)
app.use('/upload', apiRequestsLimiter)
app.use('/customers', apiRequestsLimiter)

app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true, limit: '5mb' }))
app.use(json({ limit: '5mb' }))

app.use(csrfProtection)
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
