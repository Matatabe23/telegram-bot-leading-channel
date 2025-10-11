<template>
	<div
		class="hidden w-2/3 m-4 md:flex justify-around items-center bg-gray-600 rounded-2xl p-2 flex-wrap gap-2 mx-auto min-h-[70px]"
	>
		<v-btn
			variant="flat"
			@click="$emit('backPage')"
			color="#5865f2"
			:loading="appStore.isLoading"
		>
			<v-icon>mdi-arrow-left</v-icon>
		</v-btn>

		<ConfirmAction
			:onConfirm="() => $emit('delPost')"
			confirmText="Вы уверены, что хотите удалить пост?"
		>
			<v-btn
				v-if="checkPermissions(appStore.data?.EPermissions?.DELETE_POSTS)"
				variant="flat"
				color="red"
				:loading="appStore.isLoading"
			>
				<v-icon>mdi-trash-can-outline</v-icon>
			</v-btn>
		</ConfirmAction>

		<div class="min-w-[30%] text-white">
			<v-select
				v-if="checkPermissions(appStore.data?.EPermissions?.EDIT_POSTS)"
				label="Каналы публикации"
                hide-details
				:items="channelsListSelect"
				multiple
				variant="outlined"
				v-model="useChannelList"
				@update:model-value="$emit('updateChannelList', $event)"
				:disabled="appStore.isLoading"
				:loading="appStore.isLoading"
			></v-select>
		</div>

		<v-btn
			v-if="checkPermissions(appStore.data?.EPermissions?.DELETE_POSTS)"
			variant="flat"
			@click="$emit('deleteSelectedImg')"
			color="red"
			:disabled="checkListImageLenght === 0"
			:loading="appStore.isLoading"
		>
			<v-icon>mdi-selection-remove</v-icon>
		</v-btn>

		<v-btn
			variant="flat"
			@click="$emit('nextPage')"
			color="#5865f2"
			:loading="appStore.isLoading"
		>
			<v-icon>mdi-arrow-right</v-icon>
		</v-btn>
	</div>

	<div
		class="z-10 fixed bottom-0 flex flex-col md:hidden justify-around items-center border-gray-400 bg-gray-600 rounded-lgw w-full p-2 flex-wrap gap-2 mx-auto"
	>
		<div class="w-full text-white">
			<v-select
				label="Каналы публикации"
                hide-details
				:items="channelsListSelect"
				multiple
				variant="outlined"
				v-model="useChannelList"
				@update:model-value="$emit('updateChannelList', $event)"
			></v-select>
		</div>

		<div class="flex w-full justify-evenly">
			<v-btn
				variant="flat"
				@click="$emit('backPage')"
				color="#5865f2"
			>
				<v-icon>mdi-arrow-left</v-icon>
			</v-btn>

			<v-btn
				variant="flat"
				@click="$emit('delPost')"
				color="red"
			>
				<v-icon>mdi-trash-can-outline</v-icon>
			</v-btn>

			<v-btn
				variant="flat"
				@click="$emit('deleteSelectedImg')"
				color="red"
				:disabled="checkListImageLenght === 0"
			>
				<v-icon>mdi-selection-remove</v-icon>
			</v-btn>

			<v-btn
				variant="flat"
				@click="$emit('nextPage')"
				color="#5865f2"
			>
				<v-icon>mdi-arrow-right</v-icon>
			</v-btn>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { computed } from 'vue';
	import { useSettings, checkPermissions } from '@/shared';
	import { useAppStore } from '@/app/app.store';
	import { ConfirmAction } from '../ConfirmAction';

	const { listChannels } = useSettings();
	const appStore = useAppStore();

	defineProps<{
		checkListImageLenght: number;
	}>();

	defineEmits<{
		(e: 'backPage'): void;
		(e: 'delPost'): void;
		(e: 'deleteSelectedImg'): void;
		(e: 'updateChannelList', value: string): void;
		(e: 'nextPage'): void;
	}>();

	const useChannelList = defineModel<any>('useChannelList');

	const channelsListSelect = computed(() => {
		if (!listChannels) return;
		const channelsArray = listChannels.map((channel) => ({
			title: channel.name,
			value: channel.id
		}));

		return channelsArray;
	});
</script>
