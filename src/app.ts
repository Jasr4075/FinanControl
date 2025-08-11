import 'dotenv/config'
import express from 'express'
import { initDatabase } from './database'
import router from './routes'

const app = express()

app.use(express.json())

app.use('/api', router)

initDatabase()

export default app
