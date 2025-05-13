<template>
	<div class="flex flex-col items-center w-full text-center">
		<div class="flex flex-col md:flex-row gap-2 w-full my-4">
			<v-text-field
				clearable
				label="Имя канала"
				variant="outlined"
				v-model="name"
				class="w-full"
			></v-text-field>
			<v-text-field
				clearable
				label="айди чата"
				variant="outlined"
				v-model="chatId"
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
				v-for="channel in settingsStore.listChannels"
				:key="channel.id"
				:title="channel.name"
				:value="channel.id"
				class="border-[1px]"
			>
				<v-expansion-panel-text>
					<div class="flex flex-col md:flex-row justify-between items-center">
						<v-text-field
							v-model="channel.chatId"
							variant="solo-filled"
							label="Айди чата"
							class="md:max-w-[50%] w-full"
							@update:model-value="
								updateChannel(channel.id, { chatId: channel.chatId })
							"
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
						v-for="(label, key) in IEditChannelType"
						:key="key"
						:label="`Настройка: ${label}`"
						:model-value="channel.settings.includes(label)"
						color="success"
						@update:model-value="() => updateSettings(channel, label)"
						hide-details
					/>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { addingNewChannels, deleteChannel, editChannel, useSettings } from '@/shared';
	import { IEditChannelType, IListChannels } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';
	import { debounce } from 'lodash';

	const settingsStore = useSettings();

	const toast = useToast();
	const appStore = useAppStore();

	defineEmits<{
		'get-list': [];
	}>();

	const name = ref('');
	const chatId = ref('');
	const panel = ref([]);

	const saveChannel = async () => {
		try {
			if (name.value === '' || chatId.value === '') {
				toast.error('Заполните поля');
				return;
			}

			const result = await addingNewChannels(name.value, chatId.value);

			if (result) {
				settingsStore.getListChannels();
				toast.success('Успешное добавление!');
				name.value = '';
				chatId.value = '';
			}
		} catch (e: any) {
			toast.error(e.response.data.message);
		}
	};

	const delChannel = async (id: number) => {
		try {
			appStore.isLoading = false;
			const result = await deleteChannel(id);
			toast.success(result?.message);
			await settingsStore.getListChannels();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const updateSettings = async (channelData: IListChannels, value: IEditChannelType) => {
		let settingsArray = channelData.settings ? channelData.settings.split(',') : [];

		if (channelData.settings?.includes(value)) {
			settingsArray = settingsArray.filter((item) => item !== value);
		} else {
			settingsArray.push(value);
		}

		channelData.settings = settingsArray.join(',');
		await updateChannel(channelData.id, { settings: channelData.settings });
	};

	const updateChannel = debounce(async (id: number, settings: any) => {
		await editChannel(id, settings);
	}, 500);
</script>
