import { regularPublicationTime } from '../../../models/models.js';
import { scheduleFunctionExecution } from '../../regularPublicationBot-service.js'

export async function deleteItemPublicationTimes(id: number) {
  const times = await regularPublicationTime.findByPk(id);
  if (!times) {
    throw new Error('Некорректные данные');
  }

  await regularPublicationTime.destroy({ where: { id } });
  scheduleFunctionExecution();


  return 'Успешное удаление';
}