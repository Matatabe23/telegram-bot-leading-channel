import TelegramBot from 'node-telegram-bot-api'
import sendMessageAtScheduledTime from './sendMessageAtScheduledTime.js'
import { scheduleFunctionExecution } from '../service/callCertainTime-service.js'
import { TELEGRAM_BOT_API_TOKEN } from '../const/constENV.js'
import { regularPublicationTime } from '../models/models.js'

export const bot = new TelegramBot(TELEGRAM_BOT_API_TOKEN, { polling: true })


const allRegularPublicationTimes = await regularPublicationTime.findAll();
const blocks = allRegularPublicationTimes.map((time:any) => ({
    hour: time.hour,
    minute: time.minute
}));

scheduleFunctionExecution(sendMessageAtScheduledTime, blocks)

export default bot;

