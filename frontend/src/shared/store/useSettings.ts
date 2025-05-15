import { defineStore } from 'pinia';
import { IStateStoreSettings } from '@/entities';
import { getListChannel, getListRoles } from '@/shared'

export const useSettings = defineStore('useSettings', {
    state: (): IStateStoreSettings => ({
        listChannels: [],
        listRoles: [],
    }),

    actions: {
        setStateValueByKey<T extends keyof IStateStoreSettings
            = keyof IStateStoreSettings>(key: T, value: any) {
            this[key] = value;
        },

        async getListChannels() {
            const listChannel = await getListChannel()
            this.listChannels = listChannel.data
            return this.listChannels
        },

        async getListRoles() {
            const listRoles = await getListRoles()
            this.listRoles = listRoles.map((role) => ({
                ...role,
                permissions: role.permissions ? role.permissions.split(',') : []
            }));

            return listRoles
        }


    }
});
