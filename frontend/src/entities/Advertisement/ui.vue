<template>
	<v-container>
		<!-- Таблица -->
		<v-data-table-server
			:loading="appStore.isLoading"
			:headers="headers"
			:items="listAdvertisement"
			item-key="id"
			class="elevation-1"
			v-model:items-per-page="perPage"
			v-model:page="currentPage"
			:items-length="totalItems"
			@update:sortBy="setSort"
			@update:page="getAdvertisement()"
			@update:items-per-page="getAdvertisement()"
		>
			<template v-slot:item.moderationStatus="{ item }">
				<v-select
					v-model="item.moderationStatus"
					:items="appStore.data.ADVERTISEMENT_STATUS"
					label="Статус"
					class="my-2"
					:loading="appStore.isLoading"
					@change="handleStatusUpdate(item)"
				/>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-btn
					@click="setAdvertisement(item)"
					color="primary"
					size="small"
				>
					Время публикации
				</v-btn>
			</template>
		</v-data-table-server>
	</v-container>

	<!-- Модальное окно для времени публикации -->
	<ModalWatchTime
		v-if="isWatchTime"
		@close="isWatchTime = false"
	/>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import { getListAdvertisements, updateAdvertisement } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';
	import { IAdvertisement } from './model';
	import { ModalWatchTime } from '@/widgets';

	const toast = useToast();
	const appStore = useAppStore();

	const listAdvertisement = ref<IAdvertisement[]>([]);
	const currentPage = ref(1);
	const perPage = ref(10);
	const totalItems = ref(0);
	const isWatchTime = ref(false);
	const selectAdvertisement = ref<IAdvertisement>();
	const sortBy = ref([]);

	const headers = [
		{ title: 'id', key: 'id' },
		{ title: 'Владелец', key: 'user.name' },
		{ title: 'Статус', key: 'moderationStatus' },
		{ title: 'Действия', key: 'actions', sortable: false }
	];

	const getAdvertisement = async () => {
		const result = await getListAdvertisements({
			page: currentPage.value,
			perPage: perPage.value,
			sortBy: sortBy.value?.[0]?.key,
			sortOrder: sortBy.value?.[0]?.order || 'asc'
		});
		listAdvertisement.value = result.data;
		totalItems.value = result.pagination.count;
	};

	const setAdvertisement = (advertisement: IAdvertisement) => {
		selectAdvertisement.value = advertisement;
		isWatchTime.value = true;
	};

	const handleStatusUpdate = async (advertisement: IAdvertisement) => {
		try {
			const result = await updateAdvertisement(advertisement);
			await getAdvertisement();
			toast.success(result.message);
		} catch (e: any) {
			toast.error(e.response?.data?.message || 'Ошибка при обновлении рекламы');
		}
	};

	const setSort = (sort) => {
		sortBy.value = sort;
		getAdvertisement();
	};

	onMounted(() => {
		getAdvertisement();
	});
</script>
