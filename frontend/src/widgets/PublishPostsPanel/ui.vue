<template>
	<v-dialog
		v-model="isOpen"
		width="800"
		transition="dialog-transition"
	>
		<template #default>
			<v-card class="rounded-2xl p-4 flex flex-col justify-between max-h-[90vh]">
				<button
					class="absolute top-2 right-4 z-10 w-min"
					@click="isOpen = false"
					:loading="appStore.isLoading"
				>
					<v-icon>mdi-close</v-icon>
				</button>

				<!-- Контент модалки -->
				<div class="overflow-y-auto flex-grow mt-2">
					<div class="flex flex-wrap justify-center items-center gap-2 relative">
						<div
							v-for="(photo, index) in state.images"
							:key="index"
							class="w-[25vh] h-[40vh] relative"
						>
							<img
								:src="photo"
								alt="Photo"
								class="object-contain w-full h-full"
							/>
						</div>
					</div>

					<div class="flex flex-col items-center justify-center pt-4">
						<div class="publishing-panel__select-settings w-full">
							<v-file-input
								v-model="state.imagePost"
								:loading="appStore.isLoading"
								color="#5865f2"
								multiple
								chips
								prepend-icon=""
								label="Загрузить файлы"
								@update:modelValue="handleFileInput"
								:item-value="(file) => file.name"
							>
								<template v-slot:selection="{ fileNames }">
									<template
										v-for="(fileName, index) in fileNames"
										:key="fileName"
									>
										<!-- Отображаем только один файл -->
										<v-chip
											v-if="index === 0"
											class="me-2"
											color="#5865f2"
											size="small"
											label
										>
											{{ fileName }}
										</v-chip>

										<!-- Отображаем количество дополнительных файлов -->
										<span
											v-else-if="index === 1"
											class="text-overline text-grey-darken-3 mx-2"
										>
											+{{ fileNames.length - 1 }} File(s)
										</span>
									</template>
								</template>
							</v-file-input>
						</div>

						<div class="publishing-panel__select-settings w-full">
							<v-select
								label="Настройки"
								:items="settingsSelectPublish"
								multiple
								variant="outlined"
								v-model="state.settingsArray"
								:disabled="appStore.isLoading"
								:loading="appStore.isLoading"
							/>
						</div>

						<div class="publishing-panel__select-settings w-full">
							<v-select
								label="Каналы для публикации"
								:items="channelsListSelect"
								multiple
								variant="outlined"
								v-model="state.form.useChannelList"
								:disabled="appStore.isLoading"
							/>
						</div>
					</div>
				</div>

				<!-- Нижняя правая кнопка -->
				<div class="flex justify-end p-4 gap-2">
					<v-btn
						variant="flat"
						color="green"
						@click="publicationPost"
						:disabled="state.form.useChannelList.length === 0"
						:loading="appStore.isLoading"
						v-if="checkPermissions(appStore.data?.EPermissions?.PUBLISH_POSTS)"
					>
						Опубликовать
					</v-btn>
				</div>
			</v-card>
		</template>
	</v-dialog>
</template>

<script lang="ts" setup>
	import { onMounted, reactive, watch, computed } from 'vue';
	import { checkPermissions, unifiedPublication } from '@/shared';
	import { IPublish } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { usePosts } from '@/shared';
	import { settingsSelectPublish } from '@/entities';
	import { useSettings } from '@/shared';
	import { useAppStore } from '@/app/app.store';
	import { storeToRefs } from 'pinia';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);
	const appStore = useAppStore();

	const toast = useToast();
	const editorStore = usePosts();

	const isOpen = defineModel<boolean>('isOpen');

	const state: IPublish = reactive({
		images: [],
		imagePost: [],

		processLoader: {
			overlay: false,
			total: 1,
			loaded: 0
		},

		settingsArray: [],
		form: {
			useChannelList: []
		}
	});

	const handleFileInput = (files: File[] | null) => {
		state.images = [];

		if (!files) {
			state.imagePost = [];
			return;
		}

		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					state.images.push(reader.result);
				}
			};
			reader.readAsDataURL(file);
		});
	};

	const publicationPost = async () => {
		try {
			appStore.isLoading = true;
			if (!state.imagePost.length) {
				toast.error('Некорректные данные');
				return;
			}

			if (state.imagePost.length > 10) {
				toast.error('Не более 10 медиафайлов!');
				return;
			}
			const result = await unifiedPublication(
				state.imagePost,
				state.settingsArray.includes('waterMark'),
				state.form.useChannelList,
				state.settingsArray.includes('instantPublication')
			);

			if (result) {
				state.images = [];
				state.imagePost = [];
				toast.success(result.message);
			}
			editorStore.getPosts();
		} catch (e: any) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const getSettings = async () => {
		const settingsArray = localStorage.getItem('settingsArray');
		const useChannelList = localStorage.getItem('useChannelList');
		if (settingsArray !== null && JSON.parse(settingsArray).length > 0)
			state.settingsArray = JSON.parse(settingsArray).split(',');
		if (useChannelList !== null && JSON.parse(useChannelList).length > 0)
			state.form.useChannelList = JSON.parse(useChannelList).split(',');
	};

	watch(
		() => state.settingsArray,
		(value) => {
			localStorage.setItem('settingsArray', JSON.stringify(value.join(',')));
		},
		{ deep: true }
	);

	watch(
		() => state.form.useChannelList,
		(value) => {
			localStorage.setItem('useChannelList', JSON.stringify(value.join(',')));
		},
		{ deep: true }
	);

	const channelsListSelect = computed(() =>
		listChannels.value.map((item) => ({ title: item.name, value: item.chatId }))
	);

	onMounted(() => {
		getSettings();
	});
</script>

<style lang="scss">
	.publishing-panel {
		&__custom-file-upload {
			@apply inline-block text-white font-semibold rounded-lg cursor-pointer transition ease-in-out duration-300;
		}

		&__select-settings {
			@apply w-full md:w-1/3;
		}

		#file-upload {
			@apply hidden;
		}

		.v-input__control {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
