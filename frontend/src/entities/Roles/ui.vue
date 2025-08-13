<template>
	<div class="x-ident mt-4">
		<div class="flex items-center gap-2">
			<v-text-field
				clearable
				label="Имя роли"
				variant="outlined"
				v-model="name"
                hide-details
				class="w-full"
                density="compact"
			/>

			<v-btn
				@click="addRoles"
				color="primary"
				elevation="2"
				class="font-bold text-white"
			>
				Добавить
			</v-btn>
		</div>

		<v-data-table
			:headers="headers"
			:items="listRoles"
			:loading="appStore.isLoading"
			item-value="id"
			class="elevation-1 my-4"
			:items-per-page="-1"
			@update:sortBy="setSort"
			hide-default-footer
		>
			<template v-slot:item.permissions="{ item }">
				<v-select
					:items="appStore.data.PERMISSIONS_LIST"
					v-model="item.permissions"
					multiple
                    chips
					variant="outlined"
					@update:model-value="handlePermissionsUpdate(item.id, $event)"
					:loading="appStore.isLoading"
					class="my-2 min-w-[200px]"
				/>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-btn
					@click="deleRole(item.id)"
					color="red"
					icon
				>
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts" setup>
	import { ref, watch } from 'vue';
	import { createNewRole, deleteRole, updatePermissions, useSettings } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { useAppStore } from '@/app/app.store';
	import { VDataTable, VTextField, VBtn, VSelect, VIcon } from 'vuetify/components';

	const settingsStore = useSettings();
	const toast = useToast();
	const appStore = useAppStore();

	const name = ref('');
	const listRoles = ref([]);

	const sortBy = ref([]);

	const headers = [
		{ title: 'ID', key: 'id', value: 'id' },
		{ title: 'Имя роли', key: 'name' },
		{ title: 'Права', key: 'permissions' },
		{ title: 'Действия', key: 'actions', sortable: false }
	];

	const addRoles = async () => {
		try {
			if (name.value === '') {
				toast.error('Заполните поле');
				return;
			}

			const result = await createNewRole(name.value);
			await settingsStore.getListRoles();
			name.value = '';
			toast.success(result);
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

	const setSort = (sort) => {
		sortBy.value = sort;
	};

	watch(
		() => settingsStore.listRoles,
		(value) => {
			listRoles.value = value;
		},
		{ deep: true, immediate: true }
	);
</script>
