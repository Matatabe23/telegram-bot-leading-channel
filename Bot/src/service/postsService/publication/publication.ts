import { dataBasePost, imageData } from '../../../models/models.js';
import addWatermark from '../../waterMark-service.js'
import { uploadImageToS3 } from '../../s3-service.js'

export async function publication(files: any, waterMark: boolean) {

  const post = await dataBasePost.create()
  const postId = post.dataValues.id

  for (const file of files) {
    let url: string
    if (waterMark === true) {
      await addWatermark(file)
      url = await uploadImageToS3(file)
    } else {
      url = await uploadImageToS3(file)
    }

    await imageData.create({
      image: url,
      dataBasePostId: postId
    })
  }

  return 'Успешное сохранение в базу данных!';
}