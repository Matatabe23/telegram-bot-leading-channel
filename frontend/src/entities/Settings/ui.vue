<template>
	<div class="md:flex justify-center items-start w-full">
		<AddingNewChannels v-if="checkPermissions(appStore.permissions?.CREATE_CHANNEL)" />
		<AddingPublicationTimeSettings v-if="checkPermissions(appStore.permissions?.SET_PUBLICATION_TIME)" />
	</div>
</template>

<script lang="ts" setup>
	import { useAppStore } from '@/app/app.store';
	import { checkPermissions } from '@/shared';
	import { AddingNewChannels, AddingPublicationTimeSettings } from '@/widgets';

	const appStore = useAppStore();
</script>
