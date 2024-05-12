import TelegramBot from 'node-telegram-bot-api'
import { scheduleFunctionExecution } from '../service/regularPublicationBot-service.js'
import { TELEGRAM_BOT_API_TOKEN } from '../const/constENV.js'

export const bot = new TelegramBot(TELEGRAM_BOT_API_TOKEN, { polling: true })

scheduleFunctionExecution()

export default bot;

