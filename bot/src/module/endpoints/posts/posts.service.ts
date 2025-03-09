import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DataBasePosts } from 'src/module/db/models/data-base-posts.repository';
import { Channels } from 'src/module/db/models/channels.repository';
import { ImageData } from 'src/module/db/models/image-data.repository';
import { ChannelPosts } from 'src/module/db/models/channel-posts.repository';
import { WaterMarkRepository } from 'src/module/service/water-mark/water-mark.repository';
import { S3Repository } from 'src/module/service/s3/s3.repository';
import { IImageBlock } from 'src/types/types';
import { RegularPublicationTime } from 'src/module/db/models/regular-publication-time.repository';
import { Op, Order, Sequelize } from 'sequelize';
import { FileRepository } from 'src/module/service/files/files.repository';
import { TGBotPostsRepository } from 'src/module/service/tg-bot/repository/tg-bot-posts.repository';
import { Tags } from 'src/module/db/models/tags.repository';
import { PostTags } from 'src/module/db/models/post-tags.repository';
import { HelpersRepository } from 'src/module/service/helpers/helpers.repository';
import { Holiday } from 'src/module/db/models/holiday.repository';
import { UpdateHolidaysDto } from './dto/update-holidays.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(DataBasePosts)
		private readonly dataBasePosts: typeof DataBasePosts,
		@InjectModel(ImageData)
		private readonly imageData: typeof ImageData,
		@InjectModel(Channels)
		private readonly channels: typeof Channels,
		@InjectModel(ChannelPosts)
		private readonly channelPosts: typeof ChannelPosts,
		@InjectModel(RegularPublicationTime)
		private readonly regularPublicationTime: typeof RegularPublicationTime,
		@InjectModel(Tags)
		private readonly tags: typeof Tags,
		@InjectModel(PostTags)
		private readonly postTags: typeof PostTags,
		private readonly waterMarkRepository: WaterMarkRepository,
		private readonly s3Repository: S3Repository,
		private readonly tGBotPostsRepository: TGBotPostsRepository,
		private readonly fileRepository: FileRepository,
		private readonly helpersRepository: HelpersRepository
	) {}

	async unifiedPublication(
		files: Express.Multer.File[],
		waterMark: boolean,
		chatIdList: string[],
		isInstant: boolean,
		tags?: string[]
	) {
		if (chatIdList.length === 0 || chatIdList[0] === '') {
			throw new NotFoundException('Нету каналов для публикации');
		}

		if (isInstant) {
			let processedFiles = files;

			if (waterMark) {
				processedFiles = await Promise.all(
					files.map(async (file) => ({
						...file,
						...(await this.waterMarkRepository.addWatermark(file))
					})) as Promise<Express.Multer.File>[]
				);
			}

			for (const chatId of chatIdList) {
				await this.tGBotPostsRepository.instantPublicationPosts(processedFiles, chatId);
			}

			return {
				pagination: null,
				data: null,
				message: 'Успешная моментальная публикация'
			};
		} else {
			const post = await this.dataBasePosts.create({ waterMark });
			const postId = post.dataValues.id;

			const channels = await Promise.all(
				chatIdList.map((chatId) => this.channels.findOne({ where: { chatId } }))
			);

			const channelIds = channels.map((item) => item?.dataValues.id);

			for (const file of files) {
				const url = await this.s3Repository.uploadImageToS3(
					file,
					`${process.env.S3_FOLDER_SAVED}/${postId}/${Date.now()}.png`
				);

				await this.imageData.create({
					image: url,
					dataBasePostId: postId
				});

				this.updatePosts({
					id: postId,
					channelIds
				});
			}

			const updatePost = await this.dataBasePosts.findOne({
				where: { id: postId },
				include: [
					{
						model: ImageData
					},
					{
						model: Channels
					}
				]
			});

			this.helpersRepository.createTags(tags, postId);

			return {
				pagination: null,
				data: updatePost,
				message: 'Успешное сохранение в базу данных!'
			};
		}
	}

	async updatePosts(post: { id: number; channelIds?: number[]; images?: IImageBlock[] }) {
		if (!post.id) {
			throw new NotFoundException('Неверный формат параметров запроса');
		}

		const existingRecords = await this.channelPosts.findAll({ where: { postId: post.id } });
		const existingChannelIds = existingRecords.map((record: any) => record.channelId);

		if (post.channelIds) {
			const idsToDelete = existingChannelIds.filter((id) => !post.channelIds.includes(id));
			const idsToAdd = post.channelIds.filter((id) => !existingChannelIds.includes(id));

			if (idsToDelete.length > 0) {
				await this.channelPosts.destroy({
					where: { channelId: idsToDelete, postId: post.id }
				});
			}
			if (idsToAdd.length > 0) {
				await this.channelPosts.bulkCreate(
					idsToAdd.map((channelId) => ({ channelId, postId: post.id }))
				);
			}
		}

		if (post.images?.length > 0) {
			for (const element of post.images) {
				const imageRecord = await this.imageData.findByPk(element.id);
				if (imageRecord) {
					await this.s3Repository.deleteImageFromS3(imageRecord.dataValues.image);
					await this.imageData.destroy({ where: { id: imageRecord.dataValues.id } });
				}
			}
		}

		const updatedPost = await this.dataBasePosts.findByPk(post.id, {
			include: [{ model: Channels }, { model: ImageData }]
		});

		const imageList = updatedPost.dataValues.images.map((item) => ({
			id: item.dataValues.id,
			img: `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`,
			dataBasePostId: item.dataValues.dataBasePostId
		}));

		return {
			pagination: null,
			data: { imageList, post: updatedPost },
			message: 'Успешное обновление поста!'
		};
	}

	async receiving(
		page: number,
		perpage: number,
		watched: string,
		channel: string,
		search: string
	) {
		if (isNaN(page) || isNaN(perpage)) {
			throw new NotFoundException('Неверный формат параметров запроса');
		}

		const offset = (page - 1) * perpage;

		let whereCondition: {
			watched?: boolean;
			id?: string;
		} = {};

		if (watched === 'watched') {
			whereCondition = { ...whereCondition, watched: true };
		} else if (watched === 'unwatched') {
			whereCondition = { ...whereCondition, watched: false };
		}

		if (search) {
			whereCondition = { ...whereCondition, id: search };
		}

		const posts = await this.dataBasePosts.findAll({
			include: [
				{
					model: ImageData,
					limit: 1
				},
				{
					model: Channels,
					through: { attributes: [] },
					where: channel ? { id: channel } : undefined
				}
			],
			limit: Number(perpage),
			offset: offset,
			where: whereCondition
		});

		const updatedPosts = await Promise.all(
			posts.map(async (post) => {
				// Используем toJSON(), чтобы избавиться от лишних метаданных
				const postJson = post.toJSON();

				// Преобразуем изображения
				postJson.images = postJson.images.map((img) => {
					img.image = `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${img.image}`;
					return img;
				});

				// Добавляем промт
				postJson.promt = await this.helpersRepository.getTagsByPostId(post.id);

				return postJson;
			})
		);

		const list = await this.regularPublicationTime.findAll();
		const totalCount = await this.dataBasePosts.count({
			where: whereCondition,
			include: [
				{
					model: Channels,
					through: { attributes: [] },
					where: channel ? { id: channel } : undefined
				}
			],
			distinct: true
		});

		return {
			pagination: {
				count: totalCount,
				currentPage: Number(page),
				perpage: Number(perpage)
			},
			data: updatedPosts,
			publishTime: list,
			message: 'Успешное получение постов'
		};
	}

	async deletePost(id: number) {
		const post = await this.dataBasePosts.findByPk(id);
		if (!post) {
			throw new NotFoundException('Пост не найден');
		}
		const images = await this.imageData.findAll({
			where: { dataBasePostId: id }
		});
		const imageList = images.map((item) => {
			return `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`;
		});

		await ChannelPosts.destroy({ where: { postId: id } });

		for (const image of imageList) {
			this.s3Repository.deleteImageFromS3(image);
		}

		await this.imageData.destroy({ where: { dataBasePostId: id } });

		await post.destroy();

		return {
			pagination: null,
			data: null,
			message: 'Пост успешно удален'
		};
	}

	async publishInstantly(id: number) {
		const post = await this.dataBasePosts.findOne({
			where: {
				id: id
			},
			include: [{ model: Channels }, { model: ImageData }]
		});

		if (!post) {
			throw new NotFoundException('Пост не найден');
		}

		if (post.dataValues.channels.length === 0)
			throw new NotFoundException('Нету каналов для публикации');

		const images = await this.imageData.findAll({
			where: { dataBasePostId: id }
		});

		const deletePost = async () => {
			await ChannelPosts.destroy({ where: { postId: id } });
			await this.imageData.destroy({ where: { dataBasePostId: id } });

			await post.destroy();

			for (const image of images) {
				await this.s3Repository.deleteImageFromS3(image.dataValues.image);
			}
		};

		const files = [];

		for (const image of images) {
			const result = await this.fileRepository.downloadFile(
				`${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${image.dataValues.image}`
			);

			files.push(result);
		}

		for (const element of post.dataValues.channels) {
			await this.tGBotPostsRepository.instantPublicationPosts(
				files,
				element.chatId,
				post.dataValues.waterMark
			);
		}
		await deletePost();

		return {
			pagination: null,
			data: null,
			message: 'Пост успешно опубликован'
		};
	}

	async receivingPostOrChangePage(
		id: number,
		where: string | undefined = undefined,
		watched: string | undefined = undefined,
		channel: string | undefined = undefined,
		updateWatch: boolean = false
	) {
		let whereCondition: { watched?: boolean } = {};

		// Определение фильтра для watched, если передан параметр watched
		if (watched === 'watched') {
			whereCondition = { ...whereCondition, watched: true };
		} else if (watched === 'unwatched') {
			whereCondition = { ...whereCondition, watched: false };
		}

		// Условия для пагинации
		const condition =
			where === 'next'
				? { id: { [Op.gt]: id } }
				: where === 'back'
					? { id: { [Op.lt]: id } }
					: { id }; // если не передана информация о следующей или предыдущей странице

		// Порядок сортировки для пагинации
		const order: Order =
			where === 'next'
				? [['id', 'ASC']]
				: where === 'back'
					? [['id', 'DESC']]
					: [['id', 'ASC']];

		// Получаем пост с нужными включениями и условиями
		const post = await this.dataBasePosts.findOne({
			include: [
				{
					model: Channels,
					through: { attributes: [] },
					where: channel ? { id: channel } : undefined
				},
				{ model: ImageData }
			],
			where: {
				...condition,
				...whereCondition
			},
			order: order
		});

		if (!post) {
			throw new NotFoundException('Пост не найден');
		}

		// Формирование списка изображений
		const imageList = post.images.map((item) => {
			return {
				id: item.dataValues.id,
				img: `${process.env.S3_PATH}${process.env.S3_BUCKET_NAME}/${item.dataValues.image}`,
				dataBasePostId: item.dataValues.dataBasePostId
			};
		});

		// Если нужно обновить статус просмотренного поста
		if (updateWatch) {
			await post.update({ watched: true });
		}

		// Получаем теги для поста, если нужно
		const promt = await this.helpersRepository.getTagsByPostId(post.id);

		return {
			postId: post.dataValues.id,
			imageList,
			channels: post.dataValues.channels,
			promt,
			message: 'Успешное получение поста!'
		};
	}

	async getTags(
		page: number,
		perPage: number,
		search: string,
		sortBy: string,
		sortOrder: 'ASC' | 'DESC'
	) {
		// Вычисление смещения и лимита
		page = page > 0 ? page : 1;
		perPage = perPage > 0 ? perPage : 10;
		const offset = perPage === -1 ? 0 : (page - 1) * perPage;

		// Формирование условий поиска
		const where = search
			? {
					[Op.or]: [{ name: { [Op.like]: `%${search.toLowerCase()}%` } }]
				}
			: {};

		// Поле для сортировки
		const order =
			sortBy === 'postCount'
				? Sequelize.literal(`postCount ${sortOrder}`)
				: [[sortBy, sortOrder]];

		const params: any = {
			where,
			offset: perPage === -1 ? undefined : offset,
			limit: perPage === -1 ? undefined : perPage,
			order: [order],
			include: [
				{
					model: DataBasePosts,
					through: { attributes: [] }, // Исключаем поля связи
					attributes: [] // Не загружаем сами посты
				},
				{
					model: Holiday
				}
			],
			attributes: {
				include: [
					[
						Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM \`PostTags\`
                                WHERE \`PostTags\`.\`tagId\` = \`Tags\`.\`id\`
                            )`),
						'postCount'
					]
				]
			}
		};

		// Выполнение запроса
		const { rows: tags } = await this.tags.findAndCountAll({ ...params });
		const { count: totalItems } = await this.tags.findAndCountAll({
			...params,
			distinct: true,
			subQuery: false
		});

		return {
			tags,
			pagination: {
				totalItems,
				totalPages: perPage === -1 ? 1 : Math.ceil(totalItems / perPage),
				currentPage: perPage === -1 ? 1 : page
			}
		};
	}

	async updateHolidayTag(id: number, holidays: UpdateHolidaysDto[]) {
		// Найдем тег по ID
		const tag = await Tags.findByPk(id);
		if (!tag) {
			throw new Error('Tag not found');
		}

		// Удаляем старые праздники для данного тега
		await Holiday.destroy({
			where: { tagId: id }
		});

		console.log(holidays);

		// Добавляем новые праздники
		const newHolidays = holidays.map((holiday) => ({
			name: holiday.name,
			startDate: holiday.startDate, // Начало события
			endDate: holiday.endDate, // Конец события
			eventName: holiday.eventName, // Название события
			tagId: id // ID тега
		}));

		// Сохраняем новые праздники
		await Holiday.bulkCreate(newHolidays);

		// Возвращаем обновленный тег с новыми праздниками
		const updatedTag = await Tags.findByPk(id, {
			include: Holiday // Включаем связанные праздники
		});

		return updatedTag;
	}
}
