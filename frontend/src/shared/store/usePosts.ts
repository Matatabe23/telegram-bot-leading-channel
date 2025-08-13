import { defineStore } from 'pinia';
import { IStoreStatePosts, perPage } from '@/entities';
import { receiving } from '@/shared';

export const usePosts = defineStore('posts', {
	state: (): IStoreStatePosts => ({
		postsList: [],
		totalCount: 0,
		publishTime: [],
		form: {
			currentPage: 1,
			postsPerPage: perPage[0].value,
			watched: '',
			channel: '',
			search: ''
		}
	}),

	actions: {
		setStateValueByKey<T extends keyof IStoreStatePosts = keyof IStoreStatePosts>(
			key: T,
			value: any
		) {
			this[key] = value;
		},

		async getPosts() {
			try {
				const posts = await receiving(
					this.form.currentPage,
					this.form.postsPerPage,
					this.form.watched,
					this.form.channel,
					this.form.search
				);
				this.postsList = posts.data;
				this.totalCount = posts.pagination.count;
				this.publishTime = posts.publishTime;
			} catch (e: any) {
				//
			}
		}
	}
});
