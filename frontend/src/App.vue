<template>
	<PageLayout>
		<RouterView />
	</PageLayout>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';
	import { storeToRefs } from 'pinia';
	import { RouterView } from 'vue-router';
	import { PageLayout } from './app/layouts';
	import { useRouter, useRoute } from 'vue-router';
	import { useAuth, useSettings } from '@/shared';

	const settingsStore = useSettings();
	const router = useRouter();
	const route = useRoute();
	const authStore = useAuth();
	const { auth } = storeToRefs(authStore);

	const getDataAdmin = async () => {
		await authStore.checkDataWeb();
		if (route.path === '/' && auth.value === true) {
			await router.push('publishing-page');
		} else if (route.path !== '/' && auth.value === false) {
			await router.push('/');
		}
	};

	onMounted(() => {
		getDataAdmin();
		settingsStore.getListChannels();
	});
</script>
