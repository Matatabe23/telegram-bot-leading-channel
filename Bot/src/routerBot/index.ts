import TelegramBot from 'node-telegram-bot-api'
import sendMessageAtScheduledTime from './sendMessageAtScheduledTime.js'
import { scheduleFunctionExecution } from '../service/callCertainTime-service.js'
import { TELEGRAM_BOT_API_TOKEN } from '../const/constENV.js'
import {publishTime} from '../const/const.js'

export const bot = new TelegramBot(TELEGRAM_BOT_API_TOKEN, { polling: true })

scheduleFunctionExecution(sendMessageAtScheduledTime, publishTime)

export default bot;

