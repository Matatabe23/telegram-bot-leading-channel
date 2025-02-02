<template>
	<div class="users x-ident mt-4">
		<div class="md:flex items-center gap-4 w-full lg:w-4/6">
			<v-text-field
				clearable
				label="id, имя, телеграмм айди"
				variant="outlined"
				v-model="search"
				@update:model-value="updateSearch($event)"
				:loading="appStore.isLoading"
				:disabled="appStore.isLoading"
			/>
		</div>
		<!-- Таблица -->
		<div class="overflow-x-auto custom-scroll mt-4">
			<table class="table-auto w-full border-collapse users__table-form min-w-[1300px]">
				<thead>
					<tr class="bg-gray-100">
						<th
							class="users__table-form users__padding-table text-left"
							:class="item.weight"
							v-for="item in tableForm"
							:key="item.key"
						>
							<button
								class="flex gap-1 items-center"
								@click="setSort(item.key)"
							>
								{{ item.name }}
								<Icons
									icon="ARROW_STROKE"
									:class="{
										'text-red-600': sortType && sortKey === item.key,
										'rotate-180': sortType === 'asc' && sortKey === item.key
									}"
								/>
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="user in usersList"
						:key="user.id"
					>
						<td class="users__table-form users__padding-table">{{ user.id }}</td>
						<td class="users__table-form users__padding-table">
							<div class="w-16 h-16 mx-auto">
								<img
									:src="user.avatarUrl"
									alt="User Avatar"
									class="rounded-full w-full h-full object-cover mx-auto"
								/>
							</div>
						</td>

						<td class="users__table-form users__padding-table">{{ user.name }}</td>
						<td class="users__table-form users__padding-table">
							<v-select
								label="Права"
								:items="listRoles"
								variant="outlined"
								v-model="user.role"
								:loading="appStore.isLoading"
								clearable
								clear-icon="mdi-close-circle"
								@update:model-value="updateDataUsers(user, null)"
							/>
						</td>
						<td class="users__table-form users__padding-table">{{ user.telegramId }}</td>
						<td class="users__table-form users__padding-table">
							<v-text-field
								label="coin"
								variant="outlined"
								v-model="user.coin"
								class="w-full"
								type="number"
								@update:model-value="updateCoin(user, $event)"
							/>
						</td>
						<td class="users__table-form users__padding-table">
							<VSwitch
								hide-details
								@change="updateDataUsers(user, { isTeamMember: true })"
								:model-value="user.isTeamMember"
							>
							</VSwitch>
						</td>
						<td class="users__table-form users__padding-table">
							<v-btn
								variant="flat"
								class="mb-4"
								color="red"
								:loading="appStore.isLoading"
								:disabled="appStore.isLoading"
								@click="deleteUsers(user.id)"
							>
								Удалить
							</v-btn>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<v-pagination
			v-model="currentPage"
			:length="totalPages"
			:total-visible="appStore.isMd ? 7 : 3"
			@update:model-value="setPage"
			:disabled="appStore.isLoading"
			class="text-xs"
		/>
	</div>
</template>

<script lang="ts" setup>
	import { computed, onMounted, ref } from 'vue';
	import { useDebounceFn } from '@vueuse/core';
	import {
		userData,
		deleteUser,
		getUsersList,
		updateDataUser,
		useSettings,
		Icons
	} from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';
	import { tableForm } from './const';

	const settingsStore = useSettings();
	const toast = useToast();
	const appStore = useAppStore();

	const search = ref('');
	const currentPage = ref(1);
	const totalItems = ref(0);
	const totalPages = ref(0);
	const usersList = ref<userData[]>([]);
	const sortKey = ref();
	const sortType = ref('');

	const listRoles = computed(() => {
		return settingsStore.listRoles.map((item) => ({
			title: item.name,
			value: item.name
		}));
	});

	const getUsers = async () => {
		try {
			appStore.isLoading = true;
			const infoUsers = await getUsersList({
				page: currentPage.value,
				limit: 3,
				search: search.value,
				sortBy: sortKey.value,
				sortOrder: sortType.value
			});
			usersList.value = infoUsers.users;
			totalItems.value = infoUsers.totalItems;
			totalPages.value = infoUsers.totalPages;
		} catch (e) {
			//
		} finally {
			appStore.isLoading = false;
		}
	};

	const setPage = (page: number) => {
		currentPage.value = page;
		getUsers();
	};

	const updateSearch = useDebounceFn(async (value: string) => {
		try {
			appStore.isLoading = true;
			search.value = value;
			await getUsers();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	}, 1000);

	const updateDataUsers = async (value: userData, update?: { isTeamMember?: boolean }) => {
		try {
			appStore.isLoading = true;
			await updateDataUser({
				...value,
				isTeamMember: update?.isTeamMember ? !value.isTeamMember : value.isTeamMember
			});
			toast.success('Успешное обновление пользователя');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const deleteUsers = async (id: number) => {
		try {
			const isConfirmed = window.confirm(
				'Вы уверены, что хотите удалить этого пользователя?'
			);
			if (!isConfirmed) return;

			appStore.isLoading = true;
			await deleteUser(id);
			await getUsers();
			toast.success('Успешное удаление пользователя');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const updateCoin = useDebounceFn(async (user: userData, coin: string) => {
		try {
			appStore.isLoading = true;
			await updateDataUser({
				...user,
				coin: Number(coin)
			});
			await getUsers();
			toast.success('Успешное обновление пользователя');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	}, 1000);

	const setSort = (sort: string) => {
		if (sort) {
			if (sortKey.value !== sort) {
				sortKey.value = sort;
				sortType.value = 'asc';
			} else {
				if (!sortType.value) sortType.value = 'asc';
				else if (sortType.value === 'asc') sortType.value = 'desc';
				else sortType.value = null;
			}
            getUsers()
		}
	};

	onMounted(() => getUsers());
</script>

<style lang="scss">
.users{
    &__table-form{
        @apply border border-gray-200
    }

    &__padding-table{
        @apply px-4 py-2
    }
}
</style>