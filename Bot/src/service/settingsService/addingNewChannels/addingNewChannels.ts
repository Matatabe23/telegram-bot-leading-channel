import { channels } from '../../../models/models.js';

export async function addingNewChannels(name: string, chatId: string, privated?: boolean) {
  if(!name || !chatId) throw new Error('Некорректные данные');

  await channels.create({
    name: name,
    chatId: chatId,
    privated: privated || false
  });

  return 'Успешное добавление!';
}