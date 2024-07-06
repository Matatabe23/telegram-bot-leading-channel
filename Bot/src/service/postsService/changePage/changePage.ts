import { dataBasePost, imageData } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";
import { Op } from 'sequelize';

export async function changePage(id: number, where: string, watched: string) {
  let post;

  let whereCondition: {
    watched?: boolean
  } = {};
  if (watched === 'watched') {
    whereCondition = { ...whereCondition, watched: true }
  } else if (watched === 'unwatched') {
    whereCondition = { ...whereCondition, watched: false }
  }

  if (where === 'next') {
    post = await dataBasePost.findOne({
      where: {
        id: {
          [Op.gt]: id
        }, 
        ...whereCondition
      },
      order: [['id', 'ASC']]
    });
  } else if (where === 'back') {
    post = await dataBasePost.findOne({
      where: {
        id: {
          [Op.lt]: id
        }, 
        ...whereCondition
      },
      order: [['id', 'DESC']]
    });
  }

  if (!post) {
    throw new Error('Пост не найден');
  }

  const images = await imageData.findAll({ where: { dataBasePostId: post.id } });
  const imageList = images.map((item) => {
    return {
      id: item.dataValues.id,
      img: `${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`,
      dataBasePostId: item.dataValues.dataBasePostId
    };
  });

  await post.update({ watched: true });

  return { postId: post.id, imageList };
}
