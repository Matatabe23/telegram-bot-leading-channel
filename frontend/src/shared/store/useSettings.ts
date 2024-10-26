import { defineStore } from 'pinia';
import { IStateStoreSettings } from '@/entities';
import { getListChannel } from '@/shared'

export const useSettings = defineStore('useSettings', {
    state: (): IStateStoreSettings => ({
        listChannels: [],
    }),

    actions: {
        setStateValueByKey<T extends keyof IStateStoreSettings
            = keyof IStateStoreSettings>(key: T, value: any) {
            this[key] = value;
        },

        async getListChannels() {
            this.listChannels = await getListChannel()
        }


    }
});
