<template>
	<div class="x-ident mt-4">
		<div class="md:flex items-center gap-4 w-full lg:w-4/6">
			<v-text-field
				clearable
				label="id, имя, телеграмм"
				variant="outlined"
				v-model="search"
				@update:model-value="updateSearch"
				:loading="appStore.isLoading"
			/>
		</div>

		<v-data-table-server
			:loading="appStore.isLoading"
			:headers="headers"
			:items="usersList"
			item-value="id"
			class="my-4 elevation-1"
			v-model:items-per-page="perPage"
			v-model:page="currentPage"
			:items-length="totalItems"
			@update:sortBy="setSort"
			@update:page="getUsers"
			@update:items-per-page="getUsers"
		>
			<template v-slot:item.avatarUrl="{ item }">
				<v-avatar size="48">
					<img
						:src="item.avatarUrl"
						alt="User Avatar"
						class="object-cover"
					/>
				</v-avatar>
			</template>

			<template #item.role="{ item }">
				<v-select
					label="Права"
					:items="listRoles"
					variant="outlined"
					v-model="item.role"
					:loading="appStore.isLoading"
					clearable
					clear-icon="mdi-close-circle"
					class="min-w-[200px]"
					@update:model-value="updateDataUsers(item, null)"
				/>
			</template>

			<template #item.coin="{ item }">
				<v-text-field
					label="coin"
					variant="outlined"
					v-model="item.coin"
					class="w-full my-3 min-w-[100px]"
					type="number"
					@update:model-value="updateCoin(item, $event)"
				/>
			</template>

			<template #item.isTeamMember="{ item }">
				<v-switch
					hide-details
					@change="updateDataUsers(item, { isTeamMember: true })"
					:model-value="item.isTeamMember"
				/>
			</template>

			<template #item.actions="{ item }">
				<v-btn
					:loading="appStore.isLoading"
					:disabled="appStore.isLoading"
					@click="deleteUsers(item.id)"
					color="red"
					icon
				>
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</template>
		</v-data-table-server>
	</div>
</template>

<script lang="ts" setup>
	import { computed, onMounted, ref } from 'vue';
	import { useDebounceFn } from '@vueuse/core';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';
	import { getUsersList, updateDataUser, deleteUser, useSettings } from '@/shared';

	const settingsStore = useSettings();
	const toast = useToast();
	const appStore = useAppStore();

	const search = ref('');
	const currentPage = ref(1);
	const totalItems = ref(0);
	const usersList = ref([]);
	const sortBy = ref([]);
	const perPage = ref(10);

	const headers = [
		{ title: 'ID', key: 'id', sortable: true },
		{ title: 'Аватар', key: 'avatarUrl', sortable: false },
		{ title: 'Имя', key: 'name', sortable: true },
		{ title: 'Права', key: 'role', sortable: false },
		{ title: 'Telegram ID', key: 'telegramId', sortable: true },
		{ title: 'Coin', key: 'coin', sortable: true },
		{ title: 'Команда', key: 'isTeamMember', sortable: false },
		{ title: 'Действия', key: 'actions', sortable: false }
	];

	const listRoles = computed(() =>
		settingsStore.listRoles.map((item) => ({ title: item.name, value: item.name }))
	);

	const getUsers = async () => {
		try {
			appStore.isLoading = true;
			const { users, totalItems: total } = await getUsersList({
				page: currentPage.value,
				limit: perPage.value,
				search: search.value,
				sortBy: sortBy.value?.[0]?.key,
				sortOrder: sortBy.value?.[0]?.order || 'asc'
			});
			usersList.value = users;
			totalItems.value = total;
		} finally {
			appStore.isLoading = false;
		}
	};

	const setSort = (sort) => {
		sortBy.value = sort;
		getUsers();
	};

	const updateSearch = useDebounceFn(getUsers, 1000);

	const updateDataUsers = async (user, update) => {
		try {
			appStore.isLoading = true;
			await updateDataUser({
				...user,
				isTeamMember: update?.isTeamMember ? !user.isTeamMember : user.isTeamMember
			});
			toast.success('Успешное обновление пользователя');
			getUsers();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const deleteUsers = async (id: number) => {
		if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
		try {
			appStore.isLoading = true;
			await deleteUser(id);
			getUsers();
			toast.success('Успешное удаление пользователя');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const updateCoin = useDebounceFn(async (user, coin) => {
		try {
			appStore.isLoading = true;
			await updateDataUser({ ...user, coin: Number(coin) });
			getUsers();
			toast.success('Успешное обновление пользователя');
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	}, 1000);

	onMounted(getUsers);
</script>
