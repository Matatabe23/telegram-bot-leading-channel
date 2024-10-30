<template>
	<div
		class="hidden w-2/3 m-4 md:flex justify-around items-center bg-gray-600 rounded-2xl p-2 flex-wrap gap-2 mx-auto"
	>
		<v-btn
			variant="flat"
			@click="$emit('backPage')"
			color="#5865f2"
			><Icons
				icon="ARROW_STROKE"
				class="rotate-90"
		/></v-btn>
		<v-btn
			variant="flat"
			@click="$emit('delPost')"
			color="#5865f2"
			><Icons icon="TRASH"
		/></v-btn>
		<div class="min-w-[30%] text-white">
			<v-select
				label="Каналы публикации"
				:items="channelsListSelect"
				multiple
				variant="outlined"
				v-model="useChannelList"
				@update:model-value="$emit('updateChannelList', $event)"
			></v-select>
		</div>
		<v-btn
			variant="flat"
			@click="$emit('deleteSelectedImg')"
			color="#5865f2"
			:disabled="checkListImageLenght === 0"
			><Icons icon="USER_DELETE"
		/></v-btn>
		<v-btn
			variant="flat"
			@click="$emit('nextPage')"
			color="#5865f2"
			><Icons
				icon="ARROW_STROKE"
				class="-rotate-90"
		/></v-btn>
	</div>

	<div
		class="z-10 fixed bottom-0 flex flex-col md:hidden justify-around items-center border-gray-400 bg-gray-600 rounded-lgw w-full p-2 flex-wrap gap-2 mx-auto"
	>
		<div class="w-full text-white">
			<v-select
				label="Каналы публикации"
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
				><Icons
					icon="ARROW_STROKE"
					class="rotate-90"
			/></v-btn>
			<v-btn
				variant="flat"
				@click="$emit('delPost')"
				color="#5865f2"
				><Icons icon="TRASH"
			/></v-btn>
			<v-btn
				variant="flat"
				@click="$emit('deleteSelectedImg')"
				color="#5865f2"
				:disabled="checkListImageLenght === 0"
				><Icons icon="USER_DELETE"
			/></v-btn>
			<v-btn
				variant="flat"
				@click="$emit('nextPage')"
				color="#5865f2"
				><Icons
					icon="ARROW_STROKE"
					class="-rotate-90"
			/></v-btn>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { computed } from 'vue';
	import { Icons, useSettings } from '@/shared';

	const { listChannels } = useSettings();

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
