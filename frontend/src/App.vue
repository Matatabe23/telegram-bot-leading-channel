<template>
	<PageLayout>
		<RouterView />
	</PageLayout>
</template>

<script setup lang="ts">
	import { RouterView } from 'vue-router';
	import { PageLayout } from './app/layouts';
</script>
