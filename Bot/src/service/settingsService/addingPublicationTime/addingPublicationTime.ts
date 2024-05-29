import { regularPublicationTime } from '../../../models/models.js';
import { scheduleFunctionExecution } from '../../regularPublicationBot-service.js'

export async function addingPublicationTime(hour: string, minute: string) {
  if (hour === '' || isNaN(Number(hour)) || Number(hour) < 0 || Number(hour) > 24) {
    throw new Error('Некорректные данные');
  }
  if (minute === '' || isNaN(Number(minute)) || Number(minute) < 0 || Number(minute) > 59) {
    throw new Error('Некорректные данные');
  }

  await regularPublicationTime.create({
    hour: hour,
    minute: minute
  });

  scheduleFunctionExecution();

  return 'Успешное добавление!';
}