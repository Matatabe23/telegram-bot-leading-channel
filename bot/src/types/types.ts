export interface IImageBlock {
	id: number;
	image: string;
	dataBasePostId: number;
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

	EDIT_TAGS = 'editTags' // Редактирование тегов
}

export enum ESettingChannels {
	PRIVATED = 'privated'
}

export enum WaterMarkPosition {
	BOTTOM_RIGHT = 'bottom-right',
	CENTER = 'center',
	BOTTOM_CENTER = 'bottom-center',
	TOP_LEFT = 'top-left',
	TOP_RIGHT = 'top-right',
	TOP_CENTER = 'top-center',
	LEFT_CENTER = 'left-center',
	RIGHT_CENTER = 'right-center'
}
