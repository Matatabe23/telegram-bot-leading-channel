<template>
	<div class="flex flex-col items-center text-center m-5">
		<div class="bg-gray-800 text-white border border-gray-600 p-5 rounded-lg shadow-lg md:w-80">
			<h3 class="text-lg font-bold">Добавить новую роль</h3>

			<v-text-field
				clearable
				label="Имя роли"
				variant="outlined"
				v-model="state.form.name"
				class="w-full"
			/>

			<v-btn
				color="#5865f2"
				variant="flat"
				@click="addRoles"
				class="mt-4 text-white bg-indigo-600 hover:bg-indigo-700"
				>Создать</v-btn
			>

			<h3
				v-if="settingsStore.listRoles.length"
				class="mt-6 text-lg font-bold"
			>
				Список чатов
			</h3>
			<div
				v-for="role in settingsStore.listRoles"
				:key="role.id"
				class="mt-4 flex flex-col items-center gap-2 p-4 border border-gray-600 rounded-md bg-gray-700 text-white shadow-md w-full"
			>
				<div>Имя роли: {{ role.name }}</div>

				<v-btn
					color="#5865f2"
					variant="flat"
					@click="deleRole(role.id)"
					class="text-white bg-indigo-600 hover:bg-indigo-700"
					>Удалить</v-btn
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { reactive, watch } from 'vue';
	import { createNewRole, deleteRole, useSettings } from '@/shared';
	import { IStateRoles } from '@/entities';
	import { useToast } from 'vue-toastification';

	const settingsStore = useSettings();
	const toast = useToast();

	const state: IStateRoles = reactive({
		form: {
			name: ''
		},
		listRoles: []
	});

	const addRoles = async () => {
		try {
			if (state.form.name === '') {
				toast.error('Заполните поля');
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

	watch(
		() => settingsStore.listRoles,
		(value) => {
			state.listRoles = value;
		}
	);
</script>

<style scoped></style>
