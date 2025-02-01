<template>
	<div class="x-ident mt-4">
		<!-- Таблица -->
		<div class="overflow-x-auto custom-scroll">
			<table class="table-auto w-full border-collapse border border-gray-200 min-w-[700px]">
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-200 px-4 py-2 text-left w-[4%]">id</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[20%]">Владелец</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[20%]">Статус</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(ad, index) in listAdvertisement"
						:key="index"
					>
						<td class="border border-gray-200 px-4 py-2">{{ ad.id }}</td>
						<td class="border border-gray-200 px-4 py-2">{{ ad.user.name }}</td>
						<td class="border border-gray-200 px-4 py-2">
							<v-select
								label="Статус"
								:items="appStore.ADVERTISEMENT_STATUS"
								variant="outlined"
								v-model="ad.moderationStatus"
								@update:model-value="handleStatusUpdate(ad)"
								:loading="appStore.isLoading"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<v-pagination
			v-model="page"
			:length="totalPages"
			:total-visible="appStore.isMd ? 7 : 3"
			@update:model-value="setPage"
			:disabled="appStore.isLoading"
			class="text-xs"
		/>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted, ref } from 'vue';
	import { getListAdvertisements, updateAdvertisement } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';
	import { IAdvertisement } from './model';

	const toast = useToast();
	const appStore = useAppStore();

	const listAdvertisement = ref<IAdvertisement[]>([]);
	const page = ref(1);
	const perpage = ref(3);
	const totalPages = ref(1);

	const getAdvertisement = async () => {
		const result = await getListAdvertisements({ page: page.value, perpage: perpage.value });
		listAdvertisement.value = result.data;
		totalPages.value = Math.ceil(result.pagination.count / perpage.value);
		console.log(result);
	};

	const setPage = (value: number) => {
		page.value = value;
		getAdvertisement();
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

	onMounted(() => getAdvertisement());
</script>
