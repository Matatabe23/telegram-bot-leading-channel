import * as dotenv from 'dotenv';
dotenv.config()

import sequelize from './db.js'
import express from 'express'
import * as models from './models/models.js';
import { bot } from './routerBot/index.js'
import {cleaningTheDatabase} from './service/cleaningTheDatabase.js'

import cors from 'cors'
import router from './router/index.js'

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

cleaningTheDatabase()

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
