<template>
	<div class="flex justify-center items-center flex-col text-center my-5">
		<div
			class="bg-gray-800 text-white border border-gray-600 p-5 rounded-lg shadow-lg mx-2 md:w-80"
		>
			<h3 class="text-lg font-bold">Настройка времени публикации</h3>
			<v-select
				class="mt-2"
				:items="formattedChannels"
				label="Выберите канал"
				@update:model-value="selectChanel"
				variant="outlined"
			></v-select>

			<div class="flex justify-between items-center mt-2 gap-2">
				<v-select
					id="hourInput"
					v-model="state.hour"
					:items="hoursSelectValue"
					label="Часы"
					variant="outlined"
				></v-select>
				<v-select
					id="minuteInput"
					v-model="state.minute"
					:items="minutesSelectValue"
					label="Минуты"
					variant="outlined"
				></v-select>
			</div>

			<v-btn
				color="#5865f2"
				variant="flat"
				@click="saveTime"
				class="mt-3"
				>Сохранить</v-btn
			>
			<h3
				v-if="state.listPublicationTimes.length"
				class="mt-4"
			>
				Время регулярной публикации
			</h3>
			<div
				class="flex justify-between items-center mt-2 border border-gray-600 rounded p-2 bg-gray-700 text-white shadow-sm"
				v-for="listPublicationTime in state.listPublicationTimes"
				:key="listPublicationTime.id"
			>
				<div>Часы: {{ listPublicationTime.hour }}</div>
				<div>Минуты: {{ listPublicationTime.minute }}</div>
				<v-btn
					color="#5865f2"
					variant="flat"
					@click="deleteTime(listPublicationTime.id)"
					>Удалить</v-btn
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { computed, reactive } from 'vue';
	import {
		addingPublicationTime,
		getListRegularPublicationTimes,
		deleteItemPublicationTimes,
		useSettings
	} from '@/shared';
	import { IAddingPublicationTimeSettings } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { VSelect } from 'vuetify/components';
	import { storeToRefs } from 'pinia';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);

	const toast = useToast();

	const state: IAddingPublicationTimeSettings = reactive({
		timeType: 'constant',
		hour: '0',
		minute: '0',
		channelId: 0,
		listPublicationTimes: []
	});

	const getList = async () => {
		state.listPublicationTimes = await getListRegularPublicationTimes(state.channelId);
	};

	const saveTime = async () => {
		try {
			if (state.hour === '' || state.minute === '') {
				toast.error('Заполните поля');
				return;
			}

			const result = await addingPublicationTime(state.hour, state.minute, state.channelId);

			if (result) {
				await getList();
				toast.success('Успешное добавление!');
				state.hour = '0';
				state.minute = '0';
			}
		} catch (e: any) {
			toast.error(e.response.data.message);
		}
	};

	const deleteTime = async (id: number) => {
		const result = await deleteItemPublicationTimes(id);
		toast.success(result);
		await getList();
	};

	const formattedChannels = computed(() => {
		return listChannels.value.map((channel) => channel.name);
	});

	const selectChanel = (name: string | null) => {
		const channel = listChannels.value.find((channel) => channel.name === name);
		state.channelId = Number(channel?.id);
		getList();
	};

	const hoursSelectValue = computed(() => Array.from({ length: 25 }, (_, i) => i.toString()));
	const minutesSelectValue = computed(() => Array.from({ length: 61 }, (_, i) => i.toString()));
</script>
