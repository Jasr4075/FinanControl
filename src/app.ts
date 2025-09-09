import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import { initDatabase } from './database'
import router from './routes'
import { errorHandler } from './middlewares/errorHandler'
import "./redisClient";

const app = express()

app.use(helmet())
app.use(cors())

app.use(express.json())

app.use('/api', router)

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`)
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('📦 Body:', req.body)
    }
    next()
  })
}

// Rate limiter básico
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
  })
)

initDatabase()

app.use(errorHandler);


export default app
