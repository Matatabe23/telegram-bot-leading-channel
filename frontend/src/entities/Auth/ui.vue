<template>
	<section class="flex justify-center items-center h-screen mx-2">
		<div
			class="flex flex-col items-center justify-center md:bg-gray-200 p-5 rounded-lg lg:shadow-lg w-[320px] md:w-[400px] md:h-[300px]"
		>
			<h1 class="mb-6 font-medium text-base md:text-base lg:text-xl">Авторизация</h1>
			<v-text-field
				clearable
				label="Логин"
				variant="outlined"
				v-model="name"
				class="w-full"
				:disabled="appStore.isLoading"
			></v-text-field>
			<v-text-field
				type="password"
				clearable
				label="Пароль"
				variant="outlined"
				v-model="password"
				class="w-full"
				:disabled="appStore.isLoading"
			></v-text-field>

			<v-btn
				variant="tonal"
				@click="setlogin"
				:loading="appStore.isLoading"
				class="w-full"
			>
				Авторизоваться
			</v-btn>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { login, useSettings } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useRouter } from 'vue-router';
	import { useAppStore } from '@/app/app.store';

	const toast = useToast();
	const router = useRouter();
	const appStore = useAppStore();
	const settingsStore = useSettings();

    const name = ref('')
    const password = ref('')

	const setlogin = async () => {
		try {
			const response: any = await login(name.value, password.value);
			appStore.isLoading = true;

			await appStore.setUserData(response);
			await settingsStore.getListChannels();
            await appStore.getInfo()

			router.push('/publishing-page');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};
</script>
