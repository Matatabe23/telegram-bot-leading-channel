import TelegramBot from 'node-telegram-bot-api'
import sendMessageAtScheduledTime from './sendMessageAtScheduledTime.js'
import { publishTime } from '../const/const.js'
import { scheduleFunctionExecution } from '../service/callCertainTime-service.js'

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN as string, { polling: true })

scheduleFunctionExecution(sendMessageAtScheduledTime, publishTime)

export default bot;

