import { defineStore } from 'pinia';
import { IStoreStatePosts } from '@/entities';
import { receiving } from '@/shared';

export const usePosts = defineStore('posts', {
    state: (): IStoreStatePosts => ({
        isLoader: false,
        postsList: [],
        totalCount: 0,
        publishTime: [],
        form: {
            currentPage: 1,
            postsPerPage: 3,
            watched: '',
            channel: ''
        }
    }),

    actions: {
        setStateValueByKey<T extends keyof IStoreStatePosts
            = keyof IStoreStatePosts>(key: T, value: any) {
            this[key] = value;
        },

        setIsLoader(value: boolean) {
            this.isLoader = value;
        },

        async getPosts() {
            try {
                const posts = await receiving(this.form.currentPage, this.form.postsPerPage, this.form.watched, this.form.channel);
                this.postsList = posts.posts;
                this.totalCount = posts.totalCount;
                this.publishTime = posts.publishTime;
            } catch (e: any) { }
        }
    }
});
