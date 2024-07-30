import { channels } from '../../../models/models.js';

export async function deleteChannel(id: number) {
  const times = await channels.findByPk(id);
  if (!times) {
    throw new Error('Некорректные данные');
  }

  await channels.destroy({ where: { id } });


  return 'Успешное удаление';
}