<template>
	<Modal
		title="Создание пользователя"
		@close="emit('close')"
	>
		<div>
			<v-text-field
				label="Старый пароль"
				variant="outlined"
				type="password"
				v-model="oldPassword"
				class="w-full"
				:loading="appStore.isLoading"
				:disabled="appStore.isLoading"
			/>
			<v-text-field
				label="Новый пароль"
				class="w-full"
				v-model="newPassword"
				variant="outlined"
				type="password"
				:loading="appStore.isLoading"
				:disabled="appStore.isLoading"
			/>
			<v-text-field
				label="Повторение пароля"
				class="w-full"
				v-model="repeatPassword"
				variant="outlined"
				type="password"
				:loading="appStore.isLoading"
				:disabled="appStore.isLoading"
			/>
		</div>
		<v-btn
			variant="flat"
			@click="updatePass()"
			class="mb-1"
			color="#5865f2"
			:loading="appStore.isLoading"
			:disabled="appStore.isLoading"
		>
			Изменить
		</v-btn>
	</Modal>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { useAppStore } from '@/app/app.store';
	import { Modal, updatePassword } from '@/shared';
	import { useToast } from 'vue-toastification';

	const appStore = useAppStore();
	const toast = useToast();

	const emit = defineEmits<{
		(e: 'close');
		(e: 'update-list');
	}>();

	const oldPassword = ref('');
	const newPassword = ref('');
	const repeatPassword = ref('');

	const updatePass = async () => {
		try {
			appStore.isLoading = true;
			if (!oldPassword.value && !newPassword.value && !repeatPassword.value) {
				toast.error('Заполните поля!');
                return
			}
			if (newPassword.value !== repeatPassword.value) {
				toast.error('Пароли не совпадают!');
                return
			}

			await updatePassword(oldPassword.value, newPassword.value);
			toast.success('Успешно!');
			emit('close');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};
</script>
