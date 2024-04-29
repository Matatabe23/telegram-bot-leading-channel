const moment = require('moment-timezone');
const schedule = require('node-schedule');
import {IPublishTime} from '../type/types'

export function scheduleFunctionExecution(func: any, times: IPublishTime[]) {
  moment.tz.setDefault('Europe/Moscow');

  const scheduleTimes = times.map(time => {
    const moscowTime = moment().hour(time.hour).minute(time.minute).second(0).millisecond(0);
    return new Date(moscowTime);
  });

  scheduleTimes.forEach(time => {
    schedule.scheduleJob(time, () => {
      func();
    });
  });
}