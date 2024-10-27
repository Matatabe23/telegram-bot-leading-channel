<template>
	<div class="publishing-panel flex flex-col items-center w-full my-8">
		<PublishPostsPanel />
		<PublishPostsList />
	</div>
</template>

<script lang="ts" setup>
	import { PublishPostsList, PublishPostsPanel } from '@/widgets';
</script>
