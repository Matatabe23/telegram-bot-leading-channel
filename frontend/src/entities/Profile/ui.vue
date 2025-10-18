<template>
	<section class="flex flex-col x-ident">
		<div
			v-if="userDataLocal"
			class="flex flex-col justify-center rounded-2xl md:border-2 md:p-4 md:w-min mx-auto mt-8"
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

		<div class="lg:w-[85%] mx-auto mt-4">
			<v-data-table
				:headers="HEADERS_TABLE_TOKEN"
				:items="sessions"
				:items-per-page="sessions.length"
				hide-default-footer
			>
				<template v-slot:item.buttons="{ item }">
					<ConfirmAction
						:onConfirm="deleteSession"
						:confirmParams="item.id"
						confirmText="Вы уверены, что хотите завершить сессию?"
					>
						<v-btn
							:loading="isDeleteSession === item.id"
							:disabled="item.token === currentToken"
							color="red"
						>
							<v-icon left>mdi-logout</v-icon>
						</v-btn>
					</ConfirmAction>
				</template>
			</v-data-table>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { ConfirmAction, EditAvatar } from '@/widgets';
	import { useAppStore } from '@/app/app.store';
	import { onMounted, ref, watch } from 'vue';
	import { userData, updateDataUser, getRefreshTokens, deleteToken } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { HEADERS_TABLE_TOKEN } from './consts';

	const appStore = useAppStore();
	const toast = useToast();

	const userDataLocal = ref<userData>(JSON.parse(JSON.stringify(appStore.userData)));
	const isLoadingSession = ref(true);
	const sessions = ref([]);
	const currentToken = ref(localStorage.getItem('refreshToken'));
	const isDeleteSession = ref<number | null>(null);

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

	const getSession = async () => {
		try {
			sessions.value = await getRefreshTokens();
		} catch (e) {
			//
		} finally {
			isLoadingSession.value = false;
		}
	};

	const deleteSession = async (id: number) => {
		try {
			isDeleteSession.value = id;
			await deleteToken(id);

            sessions.value = sessions.value.filter(item => item.id !== id)
		} catch (e) {
			//
		} finally {
			isDeleteSession.value = null;
		}
	};

	watch(
		() => appStore.userData,
		(val) => {
			userDataLocal.value = val;
		},
		{ deep: true, immediate: true }
	);

	onMounted(() => {
		if (userDataLocal.value) {
			getSession();
		}
	});
</script>
