import { dataBasePosts, imageData, channels } from '../../../models/models.js';
import addWatermark from '../../waterMark-service.js'
import { uploadImageToS3 } from '../../s3-service.js'
import {editPostLinkСhannels} from '../editPostLinkСhannels/editPostLinkСhannels.js'

export async function publication(files: any, waterMark: boolean, chatIdList: string[]) {

  const post = await dataBasePosts.create()
  const postId = post.dataValues.id

  const chatIds = await Promise.all(
    chatIdList.map(async (chatId) => {
      return await channels.findOne({
        where: {
          chatId: chatId
        }
      });
    })
  );
  const chatId = chatIds.map(item => item?.dataValues.id)

  for (const file of files) {
    let url: string
    if (waterMark === true) {
      await addWatermark(file)
      url = await uploadImageToS3(file, postId)
    } else {
      url = await uploadImageToS3(file, postId)
    }

    await imageData.create({
      image: url,
      dataBasePostId: postId
    })

    editPostLinkСhannels(postId, chatId)
  }

  return 'Успешное сохранение в базу данных!';
}