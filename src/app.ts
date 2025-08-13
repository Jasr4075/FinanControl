import 'dotenv/config'
import express from 'express'
import { initDatabase } from './database'
import router from './routes'

const app = express()

app.use(express.json())

app.use('/api', router)

app.use((req, _res, next) => {
    console.log('Método:', req.method, 'URL:', req.originalUrl);
    next();
  });
  

initDatabase()

export default app
