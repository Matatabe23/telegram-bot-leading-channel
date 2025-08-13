<template>
	<Modal
		title="Время публикации"
		@close="emit('close')"
	>
		<div>
			<v-text-field
				clearable
				label="Логин"
				variant="outlined"
				v-model="state.form.name"
				class="w-full"
				:loading="appStore.isLoading"
				:disabled="true"
			/>
			<v-text-field
				clearable
				label="Пароль"
				variant="outlined"
				v-model="state.form.password"
				class="w-full"
				:loading="appStore.isLoading"
				:disabled="true"
			/>
		</div>
		<v-btn
			variant="flat"
			@click="copyToClipboard()"
			class="mb-4"
			color="#5865f2"
			:loading="appStore.isLoading"
			:disabled="appStore.isLoading"
		>
			Скопировать данные
		</v-btn>
	</Modal>
</template>

<script lang="ts" setup>
	import { onMounted, reactive } from 'vue';
	import { useAppStore } from '@/app/app.store';
	import { Modal } from '@/shared';
	import { faker } from '@faker-js/faker';
	import { useToast } from 'vue-toastification';

	const appStore = useAppStore();
	const toast = useToast();

	const emit = defineEmits<{
		(e: 'close');
		(e: 'update-list');
	}>();

	const state = reactive({
		form: {
			name: '',
			password: ''
		}
	});

	const create = async () => {
		try {
			appStore.isLoading = true;
			state.form.name = faker.internet.userName();
			state.form.password = faker.internet.password();

			await emit('update-list');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const copyToClipboard = (website: string = 'https://qugor.ru/') => {
		const text = `Логин: ${state.form.name}
Пароль: ${state.form.password}

Логин и пароль можно изменить в личном кабинете
Сайт: ${website}`;

		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success('Текст успешно скопирован в буфер обмена');
			})
			.catch(() => {
				toast.error('Ошибка при копировании текста в буфер обмена');
			});
	};

	onMounted(() => create());
</script>
