import { imageData } from '../../../models/models.js';
import { deleteImageFromS3 } from '../../s3-service.js'
import { IImageBlock } from '../../../type/types.js'

export async function deleteSelectedImgs(idList: IImageBlock[]) {
  for (const element of idList) {
    const post = await imageData.findByPk(element.id);
    if (post) {
      await deleteImageFromS3(post.dataValues.image);
      await imageData.destroy({ where: { id: post.dataValues.id } });
    }
  }

  return 'Фото удалены';
}
