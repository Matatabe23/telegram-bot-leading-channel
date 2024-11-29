import { defineStore } from 'pinia';
import { useWindowSize } from '@vueuse/core/index.cjs';
import { adminData, checkDataWeb, IAppStore } from '@/shared';

const parseDataForAdmin = ({
    id, name, role, avatarUrl, telegramId
}: adminData): adminData => ({
    id,
    name,
    role,
    avatarUrl,
    telegramId
});

export const useAppStore = defineStore('app', {
    state: (): IAppStore => ({
        adminData: null,
        auth: false,
        width: 0,
        height: 0,
        isLoading: false,
        permissions: null,
        PERMISSIONS_LIST: []
    }),

    getters: {
        isLg: (state) => state.width >= 1366,
        isMd: (state) => state.width >= 768,
    },

    actions: {
        setStateValueByKey<T extends keyof IAppStore
            = keyof IAppStore>(key: T, value: any) {
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

        updateWindowSize() {
            const { height, width } = useWindowSize();
            this.width = width.value;
            this.height = height.value;
        },
    },
});
