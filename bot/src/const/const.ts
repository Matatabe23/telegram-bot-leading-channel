export enum EPermissions {
	EDIT_ROLES = 'edit_roles', // Редактировать роли

	EDIT_USERS = 'edit_users', // Редактировать пользователей

	PUBLISH_POSTS = 'publish_posts', // Публиковать посты
	EDIT_POSTS = 'edit_post', // Редактировать посты
	DELETE_POSTS = 'delete_posts', // Удалять посты

	MARK_POST_VIEWED = 'mark_post_viewed', // Делать отметку, что пост просмотрен

	CREATE_CHANNEL = 'create_channel', // Редактировать каналы

	SET_PUBLICATION_TIME = 'set_publication_time' // Редактировать время публикации
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
		title: 'Редактировать посты',
		value: EPermissions.EDIT_POSTS
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
		title: 'Редактировать каналы',
		value: EPermissions.CREATE_CHANNEL
	},
	{
		title: 'Редактировать время публикации',
		value: EPermissions.SET_PUBLICATION_TIME
	}
];

export const priceList = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{ text: '10 coins', callback_data: 1000 },
				{ text: '30 coins', callback_data: 3000 },
				{ text: '50 coins', callback_data: 5000 }
			],
			[
				{ text: '100 coins', callback_data: 10000 },
				{ text: '500 coins', callback_data: 50000 },
				{ text: '1000 coins', callback_data: 100000 }
			]
		]
	})
};
