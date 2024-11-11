<template>
	<section class="publishing-panel md:flex flex-col w-full mb-12 p-4 hidden">
		<div class="border-2 rounded-2xl">
			<div class="flex flex-wrap justify-center items-center gap-2 overflow-y-auto relative">
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

			<div
				class="flex flex-col items-center justify-center gap-2 pt-4 border-t-3 border-gray-500"
			>
				<div class="grid gap-2 md:flex justify-evenly mb-4 w-full">
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="selectFile"
						:loading="appStore.isLoading"
					>
						<input
							id="file-upload"
							type="file"
							ref="fileInput"
							multiple
							@change="handleFileUpload"
							class="hidden"
						/>
						<label
							for="file-upload"
							class="publishing-panel__custom-file-upload"
						>
							<i class="fas fa-upload"></i> Загрузить файлы
						</label>
					</v-btn>
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="selectFolder"
						:loading="appStore.isLoading"
					>
						<input
							type="file"
							id="file-upload"
							ref="folderInput"
							webkitdirectory
							@change="handleFolderSelection"
							class="hidden"
						/>
						<label class="publishing-panel__custom-file-upload">
							<i class="fas fa-upload"></i> Загрузить несколько папок
						</label>
					</v-btn>
					<v-btn
						variant="flat"
						@click="publicationPost"
						:disabled="state.form.useChannelList.length === 0"
						color="#5865f2"
						:loading="appStore.isLoading"
					>
						Опубликовать
					</v-btn>
				</div>

				<div class="flex flex-col md:flex-row justify-center gap-4 items-center w-full">
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
		</div>

		<!-- <ProcentLoader
			:overlay="state.processLoader.overlay"
			:total="state.processLoader.total"
			:loaded="state.processLoader.loaded"
		/> -->
	</section>
</template>

<script lang="ts" setup>
	import { onMounted, reactive, ref, watch, computed } from 'vue';
	import { publication, instantPublicationPosts } from '@/shared';
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

	const folderInput = ref<any>('');
	const fileInput = ref<any>('');

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

	const handleFileUpload = async (event: any) => {
		const files = event.target.files;
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					state.images.push(reader.result);
				}
			};
			state.imagePost.push(file);
			reader.readAsDataURL(file);
		}
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
			let result;
			if (state.settingsArray.includes('instantPublication')) {
				result = await instantPublicationPosts(
					state.imagePost,
					state.settingsArray.includes('waterMark'),
					state.form.useChannelList
				);
			} else {
				result = await publication(
					state.imagePost,
					state.settingsArray.includes('waterMark'),
					state.form.useChannelList
				);
			}

			if (result) {
				state.images = [];
				state.imagePost = [];
				toast.success(result);
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

	const selectFolder = () => {
		folderInput.value.click();
	};

	const selectFile = () => {
		fileInput.value.click();
	};

	const handleFolderSelection = async (event: any) => {
		try {
			const files = event.target.files;
			if (files.length === 0) return;

			const groupedFiles: any = {};

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const match = file.webkitRelativePath.match(/\/(\d+)\//);
				const number = match ? parseInt(match[1]) : null;

				if (!number) {
					toast.error('Ошибка в работе с файлами');
					return;
				}

				if (number !== null) {
					if (!groupedFiles[number]) {
						groupedFiles[number] = [];
					}
					groupedFiles[number].push(file);
				}
			}

			const folderContent = Object.values(groupedFiles);

			state.processLoader.overlay = true;
			state.processLoader.total = folderContent.length;

			for (let i = 0; i < folderContent.length; i++) {
				const file = folderContent[i] as FileList;
				await publication(
					file,
					state.settingsArray.includes('waterMark'),
					state.form.useChannelList
				);
				state.processLoader.loaded += 1;
			}

			editorStore.getPosts();
			toast.success('Успешная публикация');
		} catch (e: any) {
			toast.error(e.response.data.message);
		} finally {
			state.processLoader.overlay = false;
		}
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
	}
</style>
