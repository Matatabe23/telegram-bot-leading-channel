<template>
	<div class="x-ident mt-4">
		<!-- Таблица -->
		<div class="overflow-x-auto custom-scroll">
			<table class="table-auto w-full border-collapse border border-gray-200 min-w-[1300px]">
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-200 px-4 py-2 text-left w-[4%]">id</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[10%]">Аватарка</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[20%]">Имя</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[30%]">Роль</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[10%]">
							Телеграмм
						</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[20%] lg:w-[10%]">
							Coin
						</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[10%]">
							Участник команды?
						</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[20%]">Действия</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="user in state.usersList"
						:key="user.id"
					>
						<td class="border border-gray-200 px-4 py-2">{{ user.id }}</td>
						<td class="border border-gray-200 px-4 py-2">
							<div class="w-16 h-16 mx-auto">
								<img
									:src="user.avatarUrl"
									alt="User Avatar"
									class="rounded-full w-full h-full object-cover mx-auto"
								/>
							</div>
						</td>

						<td class="border border-gray-200 px-4 py-2">{{ user.name }}</td>
						<td class="border border-gray-200 px-4 py-2">
							<v-select
								label="Права"
								:items="listRoles"
								variant="outlined"
								v-model="user.role"
								@update:model-value="updateDataUsers(user)"
								:loading="appStore.isLoading"
								clearable
								clear-icon="mdi-close-circle"
							/>
						</td>
						<td class="border border-gray-200 px-4 py-2">{{ user.telegramId }}</td>
						<td class="border border-gray-200 px-4 py-2">
							<v-text-field
								label="coin"
								variant="outlined"
								v-model="user.coin"
								class="w-full"
                                type="number"
								@update:model-value="updateCoin(user, $event)"
							/>
						</td>
						<td class="border border-gray-200 px-4 py-2">
							<VSwitch
								hide-details
								@change="updateDataUsers(user, { isTeamMember: true })"
								:model-value="user.isTeamMember"
							>
							</VSwitch>
						</td>
						<td class="border border-gray-200 px-4 py-2">
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
			v-model="state.currentPage"
			:length="state.totalPages"
			:total-visible="appStore.isMd ? 7 : 3"
			@update:model-value="setPage"
			:disabled="appStore.isLoading"
			class="text-xs"
		/>
	</div>
</template>

<script lang="ts" setup>
	import { computed, onMounted, reactive } from 'vue';
	import { useDebounceFn } from '@vueuse/core';
	import { userData, deleteUser, getUsersList, updateDataUser, useSettings } from '@/shared';
	import { IStateUsers } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';

	const settingsStore = useSettings();
	const toast = useToast();
	const appStore = useAppStore();

	const state: IStateUsers = reactive({
		form: {
			name: ''
		},
		currentPage: 1,
		totalItems: 0,
		totalPages: 0,
		usersList: []
	});

	const listRoles = computed(() => {
		return settingsStore.listRoles.map((item) => ({
			title: item.name,
			value: item.name
		}));
	});

	const getUsers = async () => {
		try {
			appStore.isLoading = true;
			const infoUsers = await getUsersList(state.currentPage, 3);
			state.usersList = infoUsers.users;
			state.totalItems = infoUsers.totalItems;
			state.totalPages = infoUsers.totalPages;
		} catch (e) {
			//
		} finally {
			appStore.isLoading = false;
		}
	};

	const setPage = (page: number) => {
		state.currentPage = page;
		getUsers();
	};

	const updateDataUsers = async (value: userData, update?: { isTeamMember?: boolean }) => {
		try {
			appStore.isLoading = true;
			await updateDataUser({
				...value,
				isTeamMember: update.isTeamMember ? !value.isTeamMember : value.isTeamMember
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

	onMounted(() => getUsers());
</script>
