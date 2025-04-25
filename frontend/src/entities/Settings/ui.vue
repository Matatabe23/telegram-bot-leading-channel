<template>
	<div class="md:flex justify-center items-start w-full h-full">
		<v-card class="w-full h-full">
			<v-tabs
				v-model="tab"
				bg-color="primary"
			>
				<v-tab
					:value="ETabs.ADD_CHANNEL"
					v-if="checkPermissions(appStore.data?.EPermissions?.CREATE_CHANNEL)"
					>Добавить новый канал</v-tab
				>
				<v-tab
					:value="ETabs.ADD_TIME_PUBLICH"
					v-if="checkPermissions(appStore.data?.EPermissions?.SET_PUBLICATION_TIME)"
					>Добавить время публикации</v-tab
				>
			</v-tabs>

			<v-card-text>
				<v-tabs-window v-model="tab">
					<v-tabs-window-item :value="ETabs.ADD_CHANNEL">
						<AddingNewChannels />
					</v-tabs-window-item>

					<v-tabs-window-item :value="ETabs.ADD_TIME_PUBLICH">
						<AddingPublicationTimeSettings />
					</v-tabs-window-item>
				</v-tabs-window>
			</v-card-text>
		</v-card>
	</div>
</template>

<script lang="ts" setup>
	import { useAppStore } from '@/app/app.store';
	import { checkPermissions } from '@/shared';
	import { AddingNewChannels, AddingPublicationTimeSettings } from '@/widgets';
	import { ref } from 'vue';
	import { ETabs } from './model';

	const appStore = useAppStore();

	const tab = ref(ETabs.ADD_CHANNEL);
</script>
