export interface IImageBlock {
	id: number;
	image: string;
	dataBasePostId: number;
}

export enum EAdvertisementStatus {
	CREATED = 'created',
	PENDING_VERIFICATION = 'pending_verification',
	REJECTED = 'rejected',
	APPROVED = 'approved',
	ARCHIVED = 'archived',
	PUBLISHED = 'published',
	DRAFT = 'draft'
}
export enum ETypePostsAdvertisement {
	SOLO = 'solo', // Однократная публикация в указанное время
	DAILY = 'daily', // Публикация каждый день в указанное время
	RANDOM = 'random' // Случайная публикация (Ограничение неделя)
}

export enum EPermissions {
	EDIT_ROLES = 'edit_roles', // Редактировать роли

	EDIT_USERS = 'edit_users', // Редактировать пользователей

	PUBLISH_POSTS = 'publish_posts', // Публиковать посты
	EDIT_POSTS = 'edit_post', // Редактировать посты
	DELETE_POSTS = 'delete_posts', // Удалять посты

	MARK_POST_VIEWED = 'mark_post_viewed', // Делать отметку, что пост просмотрен

	CREATE_CHANNEL = 'create_channel', // Редактировать каналы

	SET_PUBLICATION_TIME = 'set_publication_time', // Редактировать время публикации,

	EDIT_ADVERTISEMENTS = 'edit_advertisements', // Редактировать рекламы

	EDIT_TAGS = 'editTags' // Редактирование тегов
}

export enum ESettingChannels {
	PRIVATED = 'privated',
	ADVERTISEMENT = 'advertisement'
}
