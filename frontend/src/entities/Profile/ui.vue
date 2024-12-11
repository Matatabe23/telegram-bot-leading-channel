<template>
	<section>
		<div
			class="x-ident flex flex-col justify-center rounded-2xl md:border-2 md:p-4 md:w-min mx-auto mt-8"
		>
			<div class="md:flex items-center gap-8 justify-center w-full">
				<EditAvatar
					v-model="userDataLocal.avatarUrl"
					:fileName="`avatar/${Date.now()}`"
					class="h-24 w-24 md:h-48 md:w-48"
				/>
				<div>
					<div class="flex items-center gap-3 md:w-[50vw] mt-8 md:mt-0">
						<v-text-field
							label="Логин"
							variant="outlined"
							v-model="userDataLocal.name"
							class="w-full"
							:loading="appStore.isLoading"
							:disabled="appStore.isLoading"
						/>
						<v-select
							class="w-full"
							label="Роль"
							v-model="userDataLocal.role"
							variant="outlined"
							:loading="appStore.isLoading"
							:disabled="true"
						></v-select>
					</div>
				</div>
			</div>
			<div class="md:flex grid gap-3">
				<v-btn
					variant="flat"
					color="#5865f2"
					@click="updateUserData"
					:loading="appStore.isLoading"
					class="md:mt-4 md:w-[20%]"
					>Сохранить
				</v-btn>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { EditAvatar } from '@/widgets';
	import { useAppStore } from '@/app/app.store';
	import { ref, watch } from 'vue';
	import { userData, updateDataUser } from '@/shared';
	import { useToast } from 'vue-toastification';

	const appStore = useAppStore();
	const toast = useToast();

	const userDataLocal = ref<userData>(JSON.parse(JSON.stringify(appStore.userData)));

	const updateUserData = () => {
		try {
			appStore.isLoading = true;
			updateDataUser(userDataLocal.value);

			toast.success('Данные обновлены успешно');
		} catch (e) {
			toast.error(e.response.data);
		} finally {
			appStore.isLoading = false;
		}
	};

	watch(
		() => appStore.userData,
		(val) => {
			userDataLocal.value = val;
		},
		{ deep: true, immediate: true }
	);
</script>
