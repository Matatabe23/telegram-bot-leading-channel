<template>
	<v-container>
		<v-data-table-server
			:loading="isLoading"
			:headers="headers"
			:items="Tags"
			item-key="id"
			class="elevation-1 my-2"
			loading-text="Загрузка данных..."
			v-model:items-per-page="perPage"
			v-model:page="currentPage"
			:items-length="totalItems"
			@update:sortBy="setSort"
			@update:page="getTags()"
			@update:items-per-page="getTags()"
		>
			<template v-slot:loading>
				<v-skeleton-loader type="table-row@10"></v-skeleton-loader>
			</template>

			<template v-slot:tfoot>
				<tr>
					<td></td>
					<td>
						<v-text-field
							class="ma-2"
							density="compact"
							placeholder="Имя тега..."
							hide-details
							v-model="search"
							@update:model-value="updateSearch"
							:loading="isLoading"
						></v-text-field>
					</td>
				</tr>
			</template>

			<template v-slot:item.holiday="{ item }">
				<v-btn
					@click="setTag(item)"
					color="primary"
					size="small"
				>
					Время публикации
				</v-btn>
			</template>
		</v-data-table-server>
	</v-container>

	<v-dialog
		v-model="isDateModel"
		max-width="800"
	>
		<v-card class="rounded-lg shadow-lg">
			<v-card-title class="text-lg font-semibold">
				Редактирование тега: {{ selectTag.name }}
			</v-card-title>

			<!-- Основной блок формы -->
			<v-card-text>
				<v-form
					ref="form"
					v-model="valid"
					@submit.prevent="saveTag"
					class="grid"
				>
					<!-- Блок для редактирования дат -->
					<v-divider></v-divider>
					<v-subheader>События</v-subheader>

					<v-row
						v-for="(holiday, index) in selectTag.holidays"
						:key="holiday.id"
						class="my-2 p-1 rounded-md"
					>
						<div class="grid w-full gap-2">
							<v-text-field
								v-model="holiday.name"
								label="Название события"
								outlined
								required
							></v-text-field>

							<div class="flex flex-col md:flex-row gap-4">
								<v-text-field
									v-model="holiday.startDate"
									label="Дата начала (MM-DD)"
									outlined
									required
									:rules="dateRules"
									class="mb-2 w-1/2"
								></v-text-field>

								<v-text-field
									v-model="holiday.endDate"
									label="Дата конца (MM-DD)"
									outlined
									required
									:rules="dateRules"
									class="mb-2 w-1/2"
								></v-text-field>
							</div>
						</div>

						<v-btn
							color="red"
							@click="removeHoliday(index)"
							class="w-full"
						>
							Удалить
						</v-btn>
					</v-row>

					<v-btn
						color="blue"
						@click="addHoliday"
						class="mt-4 md:w-1/2 lg:w-1/4"
					>
						Добавить событие
					</v-btn>
				</v-form>
			</v-card-text>

			<!-- Действия внизу -->
			<v-card-actions class="justify-between">
				<v-btn
					@click="isDateModel = false"
					color="red"
					class="px-6 py-2 rounded-md text-white font-semibold"
				>
					Закрыть
				</v-btn>
				<v-btn
					@click="saveTag"
					color="green"
					class="px-6 py-2 rounded-md text-white font-semibold"
					:disabled="!valid"
				>
					Сохранить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import { checkPermissions, receivingTags, updateHolidayTag } from '@/shared';
	import { useAppStore } from '@/app/app.store';
	import { useDebounceFn } from '@vueuse/core';
	import { ITags } from '@/entities';

	const appStore = useAppStore();

	const currentPage = ref(1);
	const perPage = ref(10);
	const totalItems = ref(0);
	const sortBy = ref([]);
	const search = ref('');
	const isLoading = ref(false);
	const Tags = ref<ITags[]>([]);

	const isDateModel = ref(false);
	const selectTag = ref();
	const valid = ref(false);
	const dateRules = [
		(v) =>
			/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(v) ||
			'Дата должна быть в формате MM-DD'
	];

	const headers = [
		{ title: 'id', key: 'id' },
		{ title: 'Имя тега', key: 'name' },
		{ title: 'Всего тегов', key: 'postCount' },
		checkPermissions(appStore.data?.EPermissions?.EDIT_TAGS)
			? { title: 'Период публикации', key: 'holiday', sortable: false }
			: {}
	];

	const getTags = async () => {
		try {
			isLoading.value = true;
			const result = await receivingTags({
				page: currentPage.value,
				perPage: perPage.value,
				sortBy: sortBy.value?.[0]?.key,
				sortOrder: sortBy.value?.[0]?.order || 'asc',
				search: search.value
			});
			Tags.value = result.tags;
			totalItems.value = result.pagination?.totalItems;
		} catch (e) {
			//
		} finally {
			isLoading.value = false;
		}
	};

	const setSort = (sort) => {
		sortBy.value = sort;
		getTags();
	};

	const setTag = (value) => {
		selectTag.value = value;
		isDateModel.value = true;
	};

	const addHoliday = () => {
		selectTag.value.holidays.push({
			id: Date.now(),
			name: '',
			startDate: '',
			endDate: ''
		});
	};

	const removeHoliday = (index) => {
		selectTag.value.holidays.splice(index, 1);
	};

	const updateTagById = (id: number, newTag: ITags) => {
		const index = Tags.value.findIndex((tag) => tag.id === id);
		if (index !== -1) {
			Tags.value[index] = newTag;
		}
	};

	const saveTag = async () => {
		try {
			const newTag = await updateHolidayTag(selectTag.value.id, selectTag.value.holidays);

			updateTagById(selectTag.value.id, newTag);

			isDateModel.value = false;
		} catch (error) {
			//
		}
	};

	const updateSearch = useDebounceFn(getTags, 1000);

	onMounted(() => {
		getTags();
	});
</script>
