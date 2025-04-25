<template>
	<div class="flex flex-col items-center w-full text-center">
		<div class="flex flex-col md:flex-row gap-2 w-full my-4">
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
			<v-btn
				color="#5865f2"
				variant="flat"
				@click="saveChannel"
				class="text-white bg-indigo-600 hover:bg-indigo-700 md:mt-3"
				>Сохранить</v-btn
			>
		</div>

		<v-expansion-panels
			v-model="panel"
			multiple
			class="detal-task__expansion-panels"
		>
			<v-expansion-panel
				v-for="channel in listChannels"
				:key="channel.id"
				:title="channel.name"
				:value="channel.id"
			>
				<v-expansion-panel-text>
					<div class="flex flex-col md:flex-row justify-between items-center">
						<v-text-field
							:model-value="channel.chatId"
							variant="solo-filled"
							label="Айди чата"
							class="md:max-w-[50%] w-full"
						/>

						<v-btn
							color="#5865f2"
							variant="flat"
							@click="delChannel(channel.id)"
							class="text-white bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto"
							>Удалить</v-btn
						>
					</div>
					<VSwitch
						hide-details
						label="Приватность чата"
						@change="updateDefaultChannel(channel, IEditChannelType.PRIVATED)"
						:model-value="channel.settings?.includes(IEditChannelType.PRIVATED)"
						color="success"
					/>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script lang="ts" setup>
	import { reactive, ref, watch } from 'vue';
	import { addingNewChannels, deleteChannel, editChannel, useSettings } from '@/shared';
	import { IStateChannels, IEditChannelType, IListChannels } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { storeToRefs } from 'pinia';
	import { useAppStore } from '@/app/app.store';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);

	const toast = useToast();
	const appStore = useAppStore();

	defineEmits<{
		'get-list': [];
	}>();

	const panel = ref([]);

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
			toast.error(e.response.data.message);
		}
	};

	const delChannel = async (id: number) => {
		try {
			appStore.isLoading = false;
			const result = await deleteChannel(id);
			toast.success(result);
			await settingsStore.getListChannels();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const updateDefaultChannel = async (channel: IListChannels, type: IEditChannelType) => {
		try {
			const settings = channel.settings?.length > 0 ? [...channel.settings.split(',')] : [];

			if (settings.includes(type)) {
				const index = settings.indexOf(type);
				if (index > -1) {
					settings.splice(index, 1);
				}
			} else if (!settings.includes(type)) {
				settings.push(type);
			}

			await updateChannelData(channel.id, { settings: settings.join(',') });
		} catch (e) {
			toast.error(e?.response?.data?.message);
		}
	};

	const updateChannelData = async (id: number, newData: any) => {
		await editChannel(id, newData);
		settingsStore.getListChannels();
	};

	watch(
		() => listChannels.value,
		(value) => {
			state.form.listChannels = value;
		}
	);
</script>
