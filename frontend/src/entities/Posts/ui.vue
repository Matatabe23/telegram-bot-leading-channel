<template>
	<div class="publishing-panel flex flex-col items-center w-full my-8">
		<PublishPostsPanel v-if="checkPermissions(appStore.data?.EPermissions?.PUBLISH_POSTS)" />
		<PublishPostsList />
	</div>
</template>

<script lang="ts" setup>
	import { useAppStore } from '@/app/app.store';
	import { checkPermissions } from '@/shared';
	import { PublishPostsList, PublishPostsPanel } from '@/widgets';

	const appStore = useAppStore();
</script>
