<template>
	<v-container>
		<div class="md:flex items-center gap-4 w-full lg:w-4/6">
			<v-text-field
				clearable
				label="Название тега"
				variant="outlined"
				v-model="search"
				@update:model-value="updateSearch"
				:loading="appStore.isLoading"
			/>
		</div>

		<!-- Таблица -->
		<v-data-table-server
			:loading="appStore.isLoading"
			:headers="headers"
			:items="Tags"
			item-key="id"
			class="elevation-1 my-2"
			v-model:items-per-page="perPage"
			v-model:page="currentPage"
			:items-length="totalItems"
			@update:sortBy="setSort"
			@update:page="getTags()"
			@update:items-per-page="getTags()"
		>
		</v-data-table-server>
	</v-container>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import { receivingTags } from '@/shared';
	import { useAppStore } from '@/app/app.store';
	import { useDebounceFn } from '@vueuse/core';

	const appStore = useAppStore();

	const currentPage = ref(1);
	const perPage = ref(10);
	const totalItems = ref(0);
	const sortBy = ref([]);
	const search = ref('');
	const Tags = ref([]);

	const headers = [
		{ title: 'id', key: 'id' },
		{ title: 'Имя тега', key: 'name' },
		// { title: 'Перевод', key: 'translate' },
		{ title: 'Всего тегов', key: 'postCount', sortable: false }
	];

	const getTags = async () => {
		const result = await receivingTags({
			page: currentPage.value,
			perPage: perPage.value,
			sortBy: sortBy.value?.[0]?.key,
			sortOrder: sortBy.value?.[0]?.order || 'asc',
			search: search.value
		});
		Tags.value = result.tags;
		totalItems.value = result.pagination?.totalItems;
	};

	const setSort = (sort) => {
		sortBy.value = sort;
		getTags();
	};

	const updateSearch = useDebounceFn(getTags, 1000);

	onMounted(() => {
		getTags();
	});
</script>
