import 'dotenv/config'
import express from 'express'
import { initDatabase } from './database'
import router from './routes'

const app = express()

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

app.use((req, _res, next) => {
    console.log('Método:', req.method, 'URL:', req.originalUrl);
    next();
  });
  

initDatabase()

export default app
