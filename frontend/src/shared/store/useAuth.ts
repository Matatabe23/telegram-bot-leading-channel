import { defineStore } from 'pinia';
import { IStoreState, adminData } from '@/entities';
import { checkDataWeb } from '@/shared';

const parseDataForAdmin = ({
    id, name, role
}: adminData): adminData => ({
    id,
    name,
    role
});

export const useAuth = defineStore('auth', {
    state: (): IStoreState => ({
        adminData: null,
        auth: false,
    }),

    actions: {
        setStateValueByKey<T extends keyof IStoreState
            = keyof IStoreState>(key: T, value: any) {
            this[key] = value;
        },

        async checkDataWeb() {
            try {
                const response: any = await checkDataWeb()
                this.adminData = parseDataForAdmin(response)
                this.auth = true;
            } catch (e) {
                //
            }
        },

        setAdminData(adminData: adminData) {
            this.adminData = parseDataForAdmin(adminData)
        },
    }
});
