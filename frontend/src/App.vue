<template>
	<v-container
		v-if="dataLoading"
		class="d-flex align-center justify-center"
		style="height: 100vh"
	>
		<v-progress-circular
			indeterminate
			color="primary"
			size="70"
		></v-progress-circular>
	</v-container>

	<PageLayout v-else>
		<RouterView />
	</PageLayout>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { RouterView } from 'vue-router';
	import { PageLayout } from './app/layouts';
	import { useRouter, useRoute } from 'vue-router';
	import { useSettings } from '@/shared';
	import { useAppStore } from '@/app/app.store';
	import { useToast } from 'vue-toastification';

	const settingsStore = useSettings();
	const router = useRouter();
	const route = useRoute();
	const appStore = useAppStore();
	const toast = useToast();

	const dataLoading = ref(true);

	const getDataAdmin = async () => {
		await appStore.checkDataWeb();
		if (route.path === '/' && appStore.auth === true) {
			await router.push('/publishing-page');
		} else if (route.path !== '/' && appStore.auth === false) {
			await router.push('/');
		}
	};

	onMounted(async () => {
		try {
			dataLoading.value = true;
			await getDataAdmin();
			await settingsStore.getListChannels();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			dataLoading.value = false;
		}
	});
</script>
