import { defineStore } from 'pinia';
import { useWindowSize } from '@vueuse/core/index.cjs';
import { userData, getMainInfo, IAppStore, getMeProfile } from '@/shared';
import { useToast } from 'vue-toastification';

const toast = useToast();

const parseDataForUser = ({ id, name, role, avatarUrl, telegramId, coin }: userData): userData => ({
	id,
	name,
	role,
	avatarUrl,
	telegramId,
	coin
});

export const useAppStore = defineStore('app', {
	state: (): IAppStore => ({
		userData: null,
		auth: false,
		width: 0,
		height: 0,
		isLoading: false,
        deviceInfo: null,
		data: {} // Здесь будем хранить все данные
	}),

	getters: {
		isLg: (state) => state.width >= 1366,
		isMd: (state) => state.width >= 768
	},

	actions: {
		setStateValueByKey<T extends keyof IAppStore = keyof IAppStore>(key: T, value: any) {
			this[key] = value;
		},

		async getMeProfile() {
			try {
				const response: any = await getMeProfile();
				this.userData = parseDataForUser(response);
				this.auth = true;
			} catch (e) {
                toast.error('Недействительная сессия')
				//
			}
		},

		setUserData(userData: userData) {
			this.userData = parseDataForUser(userData);
			this.auth = true;
		},

		updateWindowSize() {
			const { height, width } = useWindowSize();
			this.width = width.value;
			this.height = height.value;
		},

		async getInfo() {
			try {
				if (this.auth !== true) return;
				const mainInfo = await getMainInfo();
				const settingsStore = (await import('@/shared')).useSettings();

				settingsStore.listRoles = mainInfo.listRoles.map((role) => ({
					...role,
					permissions: role.permissions ? role.permissions.split(',') : []
				}));
				settingsStore.listChannels = mainInfo.listChannel;
				this.data = mainInfo.data;

				const useChannel = localStorage.getItem('useChannelList');
				const useListChannels = useChannel ? JSON.parse(useChannel).split(',') : [];
				const updatedChannels = useListChannels.filter((channelId) =>
					mainInfo.listChannel.some((channel) => channel.chatId === channelId)
				);

				if (updatedChannels.length > 0) {
					localStorage.setItem(
						'useChannelList',
						JSON.stringify(updatedChannels.join(','))
					);
				} else {
					localStorage.removeItem('useChannelList');
				}
			} catch (e) {
				toast.error(e.response.data.message || e.response);
			}
		}
	}
});
