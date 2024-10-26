<template>
	<section class="publishing-panel flex flex-col items-center w-full my-8">
		<PublishPostsPanel />
		<PublishPostsList />
	</section>
</template>

<script lang="ts" setup>
	import { PublishPostsList, PublishPostsPanel } from '@/widgets';
</script>
