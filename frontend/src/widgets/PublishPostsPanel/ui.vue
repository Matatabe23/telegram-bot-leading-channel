<template>
	<div
		class="publishing-panel w-11/12 mx-auto min-w-[650px] mb-12 border-3 border-gray-600 rounded-lg bg-gray-800 p-4"
	>
		<div class="publishing-panel__image">
			<div
				class="publishing-panel__image-form flex flex-wrap justify-center items-center gap-2 overflow-y-auto relative"
			>
				<div
					v-for="(photo, index) in state.images"
					:key="index"
					class="publishing-panel__form w-[25vh] h-[40vh] relative"
				>
					<img
						:src="photo"
						alt="Photo"
						class="object-contain w-full h-full"
					/>
				</div>
			</div>

			<div
				class="publishing-panel__publishes-form flex flex-col items-center justify-center gap-2 pt-4 border-t-3 border-gray-500"
			>
				<div class="publishing-panel__buttons flex justify-around mb-4">
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="selectFile"
						class="text-white"
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
							class="publishing-panel__custom-file-upload text-white"
						>
							<i class="fas fa-upload"></i> Загрузить файлы
						</label>
					</v-btn>
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="selectFolder"
						class="text-white"
					>
						<input
							type="file"
							id="file-upload"
							ref="folderInput"
							webkitdirectory
							@change="handleFolderSelection"
							class="hidden"
						/>
						<label class="publishing-panel__custom-file-upload text-white">
							<i class="fas fa-upload"></i> Загрузить несколько папок
						</label>
					</v-btn>
					<v-btn
						variant="flat"
						@click="publicationPost"
						:disabled="state.form.useChannelList.length === 0"
						color="#5865f2"
						class="text-white"
					>
						Опубликовать
					</v-btn>
				</div>

				<div class="publishing-panel__selects flex justify-around">
					<div class="publishing-panel__select-settings w-1/3 text-white">
						<v-select
							label="Настройки"
							:items="settingsSelectPublish"
							multiple
							variant="outlined"
							v-model="state.settingsArray"
						/>
					</div>
					<div class="publishing-panel__select-settings w-1/3 text-white">
						<v-select
							label="Каналы для публикации"
							:items="channelsListSelect"
							multiple
							variant="outlined"
							v-model="state.form.useChannelList"
						/>
					</div>
				</div>
			</div>
		</div>

		<ProcentLoader
			:overlay="state.processLoader.overlay"
			:total="state.processLoader.total"
			:loaded="state.processLoader.loaded"
		/>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted, reactive, ref, watch, computed } from 'vue';
	import { publication, instantPublicationPosts } from '@/shared';
	import { IPublish } from '@/entities';
	import { useToast } from 'vue-toastification';
	import { usePosts } from '@/shared';
	import { settingsSelectPublish } from '@/entities';
	import { useSettings } from '@/shared';
	import { storeToRefs } from 'pinia';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);

	const toast = useToast();
	const editorStore = usePosts();

	const folderInput = ref('');
	const fileInput = ref('');

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
			if (!state.imagePost.length) {
				toast.error('Некорректные данные');
				return;
			}

			editorStore.setStateValueByKey('isLoader', true);

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
			editorStore.setStateValueByKey('isLoader', false);
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
		@apply flex flex-col w-full min-w-[650px] mb-12 p-4 border-2 border-gray-600 rounded-lg bg-gray-800;

		&__image-form {
			@apply flex flex-wrap justify-center items-center gap-2 overflow-y-auto relative;
		}

		&__form {
			@apply w-[25vh] h-[40vh] relative object-contain;
		}

		&__publishes-form {
			@apply flex flex-col items-center justify-center gap-2 pt-4 border-t-2 border-gray-500;
		}

		&__buttons {
			@apply flex justify-around mb-4;
		}

		&__custom-file-upload {
			@apply inline-block text-white font-semibold rounded-lg cursor-pointer transition ease-in-out duration-300;
		}

		&__select-settings {
			@apply w-1/3 text-white;
		}

		#file-upload {
			@apply hidden;
		}
	}
</style>
