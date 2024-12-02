export enum EPermissions {
	EDIT_ROLES = 'edit_roles', // Редактировать роли
	EDIT_USERS = 'edit_users', // Редактировать пользователей
	PUBLISH_POSTS = 'publish_posts', // Публиковать посты
	DELETE_POSTS = 'delete_posts', // Удалять посты
	MARK_POST_VIEWED = 'mark_post_viewed', // Делать отметку, что пост просмотрен
	CREATE_CHANNEL = 'create_channel', // Создавать каналы
	SET_PUBLICATION_TIME = 'set_publication_time' // Устанавливать время публикации
}

export const PERMISSIONS_LIST = [
	{
		title: 'Редактировать роли',
		value: EPermissions.EDIT_ROLES
	},
	{
		title: 'Редактировать пользователей',
		value: EPermissions.EDIT_USERS
	},
	{
		title: 'Публиковать посты',
		value: EPermissions.PUBLISH_POSTS
	},
	{
		title: 'Удалять посты',
		value: EPermissions.DELETE_POSTS
	},
	{
		title: 'Делать отметку, что пост просмотрен',
		value: EPermissions.MARK_POST_VIEWED
	},
	{
		title: 'Создавать каналы',
		value: EPermissions.CREATE_CHANNEL
	},
	{
		title: 'Устанавливать время публикации',
		value: EPermissions.SET_PUBLICATION_TIME
	}
];
