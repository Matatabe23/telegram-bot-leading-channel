<template>
	<div class="flex flex-col items-center text-center m-5">
		<div class="bg-gray-800 text-white border border-gray-600 p-5 rounded-lg shadow-lg md:w-80">
			<h3 class="text-lg font-bold">Добавить новый канал</h3>

			<div class="mt-4 space-y-4">
				<v-text-field
					clearable
					label="Имя канала"
					variant="outlined"
					v-model="state.form.name"
					class="w-full"
				></v-text-field>
				<v-text-field
					clearable
					label="айди чата"
					variant="outlined"
					v-model="state.form.chatId"
					class="w-full"
				></v-text-field>
			</div>

			<v-btn
				color="#5865f2"
				variant="flat"
				@click="saveChannel"
				class="mt-4 text-white bg-indigo-600 hover:bg-indigo-700"
				>Сохранить</v-btn
			>

			<h3
				v-if="listChannels.length"
				class="mt-6 text-lg font-bold"
			>
				Список чатов
			</h3>
			<div
				v-for="channel in listChannels"
				:key="channel.id"
				class="mt-4 flex flex-col items-center gap-2 p-4 border border-gray-600 rounded-md bg-gray-700 text-white shadow-md w-full"
			>
				<div>Имя чата: {{ channel.name }}</div>
				<div>Айди чата: {{ channel.chatId }}</div>
				<VSwitch
					hide-details
					label="Приватность чата"
					@change="updateDefaultChannel(channel, IEditChannelType.PRIVATED)"
					:model-value="channel.settings.includes(IEditChannelType.PRIVATED)"
				>
				</VSwitch>

				<v-btn
					color="#5865f2"
					variant="flat"
					@click="delChannel(channel.id)"
					class="text-white bg-indigo-600 hover:bg-indigo-700"
					>Удалить</v-btn
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { reactive, watch } from 'vue';
	import { addingNewChannels, deleteChannel, editChannel, useSettings } from '@/shared';
	import { IStateChannels, IEditChannelType, IListChannels } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { storeToRefs } from 'pinia';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);

	const toast = useToast();

	defineEmits<{
		'get-list': [];
	}>();

	const state: IStateChannels = reactive({
		form: {
			name: '',
			chatId: '',
			listChannels: []
		}
	});

	const saveChannel = async () => {
		try {
			if (state.form.name === '' || state.form.chatId === '') {
				toast.error('Заполните поля');
				return;
			}

			const result = await addingNewChannels(state.form.name, state.form.chatId);

			if (result) {
				settingsStore.getListChannels();
				toast.success('Успешное добавление!');
				state.form.name = '';
				state.form.chatId = '';
			}
		} catch (e: any) {
			toast.error(e.response.data);
		}
	};

	const delChannel = async (id: number) => {
		const result = await deleteChannel(id);
		toast.success(result);
		settingsStore.getListChannels();
	};

	const updateDefaultChannel = async (channel: IListChannels, type: IEditChannelType) => {
		try {
			const settings = channel.settings.length > 0 ? [...channel.settings.split(',')] : [];

			if (settings.includes(type)) {
				const index = settings.indexOf(type);
				if (index > -1) {
					settings.splice(index, 1);
				}
			} else if (!settings.includes(type)) {
				settings.push(type);
			}

			await editChannel(channel.id, settings);
			settingsStore.getListChannels();
		} catch (e) {
			console.error(e);
		}
	};

	watch(
		() => listChannels.value,
		(value) => {
			state.form.listChannels = value;
		}
	);
</script>

<style scoped></style>
