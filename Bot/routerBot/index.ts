const TelegramBot = require('node-telegram-bot-api');
const { sendMessageAtScheduledTime } = require('./sendMessageAtScheduledTime');
import {publishTime} from '../const/const'
import {scheduleFunctionExecution} from '../service/callCertainTime-service'

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true });

scheduleFunctionExecution(sendMessageAtScheduledTime, publishTime)
