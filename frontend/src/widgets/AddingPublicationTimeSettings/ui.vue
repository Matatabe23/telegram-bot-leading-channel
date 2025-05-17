<template>
	<div class="flex flex-col">
		<div class="flex flex-col md:flex-row items-center gap-2 mt-2">
			<v-select
				id="hourInput"
				v-model="selectChannel"
				:items="settingsStore.listChannels"
				item-title="name"
				return-object
				label="Канал"
				variant="outlined"
				class="w-full"
			/>

			<div class="flex justify-between w-full items-center gap-2">
				<v-select
					id="hourInput"
					v-model="hour"
					:items="hoursSelectValue"
					label="Часы"
					variant="outlined"
					:disabled="!selectChannel"
				></v-select>
				<v-select
					id="minuteInput"
					v-model="minute"
					:items="minutesSelectValue"
					label="Минуты"
					variant="outlined"
					:disabled="!selectChannel"
				></v-select>
			</div>

			<v-btn
				class="w-full md:w-auto"
				color="primary"
				@click="saveTime"
				>Сохранить</v-btn
			>
		</div>

		<v-expansion-panels
			v-model="panel"
			multiple
			class="detal-task__expansion-panels"
		>
			<v-expansion-panel
				v-for="time in selectChannel?.regularPublicationTimes"
				:key="time.id"
				:title="`${time.hour}:${time.minute}`"
				:value="time.id"
				class="border-[1px]"
			>
				<v-expansion-panel-text>
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="deleteTime(time.id)"
						class="text-white bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto"
						>Удалить</v-btn
					>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue';
	import { editChannel, useSettings } from '@/shared';
	import { IListChannels } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { VSelect } from 'vuetify/components';

	const settingsStore = useSettings();

	const toast = useToast();

	const selectChannel = ref<IListChannels>(null);
	const hour = ref('0');
	const minute = ref('0');
	const panel = ref([]);

	const hoursSelectValue = computed(() => Array.from({ length: 24 }, (_, i) => i.toString()));
	const minutesSelectValue = computed(() => Array.from({ length: 60 }, (_, i) => i.toString()));

	const saveTime = async () => {
		try {
			if (hour.value === '' || minute.value === '') {
				toast.error('Заполните поля');
				return;
			}

			const result = await editChannel(selectChannel.value?.id, {
				regularPublicationTimes: [
					...selectChannel.value.regularPublicationTimes,
					{
						hour: hour.value,
						minute: minute.value,
						channelId: selectChannel.value
					}
				]
			});

			selectChannel.value = result.data;

			if (result) {
				toast.success('Успешное добавление!');
				hour.value = '0';
				minute.value = '0';
				settingsStore.getListChannels();
			}
		} catch (e: any) {
			toast.error(e.response.data.message);
		}
	};

	const deleteTime = async (id: number) => {
		const result = await editChannel(selectChannel.value?.id, {
			regularPublicationTimes: [
				...selectChannel.value.regularPublicationTimes.filter((item) => item.id !== id)
			]
		});

		selectChannel.value = result.data;
		settingsStore.getListChannels();
	};
</script>
