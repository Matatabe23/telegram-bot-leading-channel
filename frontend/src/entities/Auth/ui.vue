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
				v-model="state.auth.name"
				class="w-full"
				:disabled="state.loading"
			></v-text-field>
			<v-text-field
				type="password"
				clearable
				label="Пароль"
				variant="outlined"
				v-model="state.auth.password"
				class="w-full"
				:disabled="state.loading"
			></v-text-field>

			<v-btn
				variant="tonal"
				@click="setlogin"
				:loading="state.loading"
				class="w-full"
			>
				Авторизоваться
			</v-btn>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { reactive } from 'vue';
	import { IAuth } from '@/entities';
	import { login, useAuth } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useRouter } from 'vue-router';

	const toast = useToast();
	const editorStore = useAuth();
	const router = useRouter();

	const state: IAuth = reactive({
		auth: {
			name: '',
			password: ''
		},
		loading: false
	});

	const setlogin = async () => {
		try {
			const response: any = await login(state.auth.name, state.auth.password);
			state.loading = true;

			editorStore.setAdminData(response);

			router.push('/publishing-page');
		} catch (e: any) {
			toast.error(e.response.data.message);
		} finally {
			state.loading = false;
		}
	};
</script>
