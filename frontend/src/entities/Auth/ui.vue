<template>
	<section class="flex justify-center items-center h-screen mx-2">
		<div
			class="flex flex-col items-center justify-center md:bg-gray-200 p-5 rounded-lg lg:shadow-lg w-[320px] md:w-[400px] md:h-[200px]"
		>
			<h1 class="mb-6 font-medium text-base md:text-base lg:text-xl">Авторизация</h1>
			<v-text-field
				clearable
				label="Логин"
				variant="outlined"
				v-model="name"
				class="w-full"
				:loading="appStore.isLoading"
				:disabled="appStore.isLoading"
			></v-text-field>

			<v-btn
				variant="tonal"
				@click="setlogin"
				:loading="appStore.isLoading"
				:disabled="appStore.isLoading"
				class="w-full"
			>
				Авторизоваться
			</v-btn>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { onMounted, ref } from 'vue';
	import { getDeviceInfo, login, useSettings } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useRouter } from 'vue-router';
	import { useAppStore } from '@/app/app.store';
	import { ToastID } from 'vue-toastification/dist/types/types';

	const toast = useToast();
	const router = useRouter();
	const appStore = useAppStore();
	const settingsStore = useSettings();

	const name = ref('');

	const setlogin = async () => {
		let successToastId: ToastID;

		if (!name.value) {
			toast.error('Укажите логин');
			return;
		}

		try {
			appStore.isLoading = true;

			successToastId = toast.success('Подтвердите авторизацию', {
				timeout: 60000
			});

			const result = await login({
				name: name.value,
				deviceInfo: {
					deviceName: appStore.deviceInfo.deviceName,
					deviceType: appStore.deviceInfo.deviceType,
					userAgent: appStore.deviceInfo.userAgent,
					ipAddress: appStore.deviceInfo.ipAddress,
					timezone: appStore.deviceInfo.timezone,
					location: appStore.deviceInfo.locationInfo?.city
						? `${appStore.deviceInfo.locationInfo.city}, ${appStore.deviceInfo.locationInfo.country}`
						: null,
					latitude: appStore.deviceInfo.locationInfo?.latitude,
					longitude: appStore.deviceInfo.locationInfo?.longitude,
					country: appStore.deviceInfo.locationInfo?.country,
					city: appStore.deviceInfo.locationInfo?.city,
					region: appStore.deviceInfo.locationInfo?.region
				}
			});

			await appStore.setUserData(result);
			await settingsStore.getListChannels();
			await appStore.getInfo();

			router.push('/publishing-page');
		} catch (e) {
			toast.error(e.response?.data?.message || 'Произошла ошибка');
		} finally {
			appStore.isLoading = false;

			toast.dismiss(successToastId);
		}
	};

	const handleKeyUp = (event) => {
		if (event.key === 'Enter') {
			setlogin();
		}
	};

	onMounted(() => {
		document.addEventListener('keyup', handleKeyUp);
	});
</script>
