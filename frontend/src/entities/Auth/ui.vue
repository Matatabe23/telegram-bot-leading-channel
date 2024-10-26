<template>
	<section class="flex justify-center items-center h-screen">
		<div
			class="flex flex-col items-center justify-center bg-gray-200 p-5 rounded-lg shadow-lg w-[400px] h-[300px]"
		>
			<h1>Авторизация</h1>
			<v-text-field
				clearable
				label="Логин"
				variant="outlined"
				v-model="state.auth.name"
				class="w-[280px]"
			></v-text-field>
			<v-text-field
				type="password"
				clearable
				label="Пароль"
				variant="outlined"
				v-model="state.auth.password"
				class="w-[280px]"
			></v-text-field>
			<v-btn
				variant="tonal"
				@click="setlogin"
				class="w-[290px] mb-2"
			>
				Авторизоваться
			</v-btn>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { reactive } from 'vue';
	import { IAuth } from '@/entities';
	import { login } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useAuth } from '@/shared';
	import { useRouter } from 'vue-router';

	const toast = useToast();
	const editorStore = useAuth();
	const router = useRouter();

	const state: IAuth = reactive({
		auth: {
			name: '',
			password: ''
		}
	});

	const setlogin = async () => {
		try {
			const response: any = await login(state.auth.name, state.auth.password);

			editorStore.setAdminData(response);

			router.push('/publishing-page');
		} catch (e: any) {
			toast.error(e.response.data.message);
		}
	};
</script>
