import 'dotenv/config'
import express from 'express'
import { initDatabase } from './database'


const app = express()

initDatabase()


export default app
