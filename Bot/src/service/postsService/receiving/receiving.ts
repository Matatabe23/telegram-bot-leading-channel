import { dataBasePosts, imageData, regularPublicationTime } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";

export async function receiving(page: number, pageSize: number, watched?: string) {
  if (isNaN(page) || isNaN(pageSize)) {
    throw new Error('Неверный формат параметров запроса');
  }

  const offset = (page - 1) * pageSize;

  let whereCondition: {
    watched?: boolean
  } = {};
  if (watched === 'watched') {
    whereCondition = { ...whereCondition, watched: true }
  } else if (watched === 'unwatched') {
    whereCondition = { ...whereCondition, watched: false }
  }

  const posts = await dataBasePosts.findAll({
    include: [{
      model: imageData,
      limit: 1
    }],
    limit: pageSize,
    offset: offset,
    where: whereCondition
  });

  const totalCount = await dataBasePosts.count({
    where: whereCondition
  });

  const updatedPosts = posts.map(post => {
    post.dataValues.imageData = post.dataValues.imageData.map(img => {
      img.image = `${S3_PATH}${S3_BUCKET_NAME}/${img.dataValues.image}`;
      return img;
    });
    return post;
  });
  const list = await regularPublicationTime.findAll()

  return { posts: updatedPosts, totalCount, publishTime: list };
}