import { defineStore } from 'pinia';
import { IStoreState, IPosts, IPublishTime } from '@/types';

export const usePosts = defineStore('posts', {
  state: (): IStoreState => ({
    isLoader: false,
    postsList: null,
    totalCount: 0,
    publishTime: null
  }),

  actions: {
    setIsLoader(value: boolean) {
      this.isLoader = value;
    },
  }
});
