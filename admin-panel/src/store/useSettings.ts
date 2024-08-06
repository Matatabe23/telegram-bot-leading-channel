import { defineStore } from 'pinia';
import { IStoreState } from '@/store/type/settings.i';
import { getListChannel } from '@/http/settingsAPI'

export const useSettings = defineStore('useSettings', {
  state: (): IStoreState => ({
    listChannels: [],
  }),

  actions: {
    setStateValueByKey<T extends keyof IStoreState
      = keyof IStoreState>(key: T, value: any) {
      this[key] = value;
    },

    async getListChannels()  {
      this.listChannels = await getListChannel()
    }


  }
});
