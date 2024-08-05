import { dataBasePosts, imageData, channels } from '../../../models/models.js';
import { S3_BUCKET_NAME, S3_PATH } from "../../../const/constENV.js";
import { Op } from 'sequelize';

export async function changePage(id: number, where: string, watched: string) {
  let whereCondition: {
    watched?: boolean
  } = {};
  if (watched === 'watched') {
    whereCondition = { ...whereCondition, watched: true }
  } else if (watched === 'unwatched') {
    whereCondition = { ...whereCondition, watched: false }
  }

  const condition = where === 'next' 
  ? { [Op.gt]: id } 
  : where === 'back' 
  ? { [Op.lt]: id } 
  : null;

const order = where === 'next' 
  ? [['id', 'ASC']] 
  : where === 'back' 
  ? [['id', 'DESC']] 
  : [['id', 'ASC']];


  const post = await dataBasePosts.findOne({
    include: [
      { model: channels },
      { model: imageData },
    ],
    where: {
      id: condition,
      ...whereCondition
    },
    ...order
  });

  const channelsList = await channels.findAll();

  if (!post) {
    throw new Error('Пост не найден');
  }

  const images = await imageData.findAll({ where: { dataBasePostId: post.dataValues.id } });
  const imageList = images.map((item) => {
    return {
      id: item.dataValues.id,
      img: `${S3_PATH}${S3_BUCKET_NAME}/${item.dataValues.image}`,
      dataBasePostId: item.dataValues.dataBasePostId
    };
  });

  await post.update({ watched: true });

  return { postId: post.dataValues.id, imageList, channelsPost: post.dataValues.channels, channelsList };
}
