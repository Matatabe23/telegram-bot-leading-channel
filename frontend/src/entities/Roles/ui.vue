<template>
	<div class="x-ident mt-4">
		<!-- Поле для добавления новой строки -->
		<div class="mb-4 flex items-center gap-2">
			<!-- Инпут из Vuetify -->
			<v-text-field
				clearable
				label="Имя роли"
				variant="outlined"
				v-model="state.form.name"
				class="w-full"
			/>
			<!-- Кнопка -->
			<v-btn
				@click="addRoles"
				color="primary"
				elevation="2"
				class="font-bold text-white"
			>
				Добавить
			</v-btn>
		</div>

		<!-- Таблица -->
		<div class="overflow-x-auto custom-scroll">
			<table class="table-auto w-full border-collapse border border-gray-200 min-w-[700px]">
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-200 px-4 py-2 text-left w-[4%]">id</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[20%]">Имя роли</th>
						<th class="border border-gray-200 px-4 py-2 text-left w-[50%]">Права</th>
						<th class="border border-gray-200 px-4 py-2 text-left">Действия</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(role, index) in state.listRoles"
						:key="index"
					>
						<td class="border border-gray-200 px-4 py-2">{{ role.id }}</td>
						<td class="border border-gray-200 px-4 py-2">{{ role.name }}</td>
						<td class="border border-gray-200 px-4 py-2">
							<v-select
								label="Права"
								:items="appStore.PERMISSIONS_LIST"
								multiple
								variant="outlined"
								v-model="role.permissions"
								@update:model-value="handlePermissionsUpdate(role.id, $event)"
								:loading="appStore.isLoading"
							/>
						</td>
						<td class="border border-gray-200 px-4 py-2">
							<button
								@click="deleRole(role.id)"
								class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
							>
								Удалить
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { reactive, watch } from 'vue';
	import { createNewRole, deleteRole, updatePermissions, useSettings } from '@/shared';
	import { IStateRoles } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';

	const settingsStore = useSettings();
	const toast = useToast();
	const appStore = useAppStore();

	const state: IStateRoles = reactive({
		form: {
			name: ''
		},
		listRoles: []
	});

	const addRoles = async () => {
		try {
			if (state.form.name === '') {
				toast.error('Заполните поле');
				return;
			}

			const result = await createNewRole(state.form.name);

			state.form.name = '';
			toast.success(result);
			await settingsStore.getListRoles();
		} catch (e: any) {
			toast.error(e.response.data.message);
		}
	};

	const deleRole = async (id: number) => {
		const result = await deleteRole(id);
		toast.success(result);
		await settingsStore.getListRoles();
	};

	const handlePermissionsUpdate = async (roleId: number, permissions: string[]) => {
		try {
			await updatePermissions(roleId, permissions.join(','));
			await settingsStore.getListRoles();
		} catch (e: any) {
			toast.error(e.response?.data?.message || 'Ошибка при обновлении прав');
		}
	};

	watch(
		() => settingsStore.listRoles,
		(value) => {
			state.listRoles = value;
		},
		{ deep: true, immediate: true }
	);
</script>
