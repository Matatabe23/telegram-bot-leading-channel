import { channels } from '../../../models/models.js';

export async function addingNewChannels(name: string, chatId: string) {
  if(!name || !chatId) throw new Error('Некорректные данные');

  console.log(name, chatId)

  await channels.create({
    name: name,
    chatId: chatId,
    settings: ''
  });

  return 'Успешное добавление!';
}