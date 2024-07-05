import { defineStore } from 'pinia';
import { IStoreState } from '@/store/type/posts.i';
import { receiving } from '@/http/postsAPI';

export const usePosts = defineStore('posts', {
  state: (): IStoreState => ({
    isLoader: false,
    postsList: [],
    totalCount: 0,
    publishTime: [],
    form: {
      currentPage: 1,
      postsPerPage: 3
    }
  }),

  actions: {
    setStateValueByKey<T extends keyof IStoreState
      = keyof IStoreState>(key: T, value: any) {
      this[key] = value;
    },

    setIsLoader(value: boolean) {
      this.isLoader = value;
    },

    async getPosts() {
      try {
        const posts = await receiving(this.form.currentPage, this.form.postsPerPage);
        this.postsList = posts.posts;
        this.totalCount = posts.totalCount;
        this.publishTime = posts.publishTime;
      } catch (e: any) {
        console.error(e);
      }
    }
  }
});
