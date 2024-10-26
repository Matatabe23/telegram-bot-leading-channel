<template>
	<div class="posts mx-auto w-11/12 min-w-[500px] min-h-[500px] relative">
		<div class="posts__header flex justify-between mb-2.5">
			<div class="posts__info mb-2.5">
				<div v-if="totalCount">Всего постов: {{ totalCount }}</div>
				<div v-if="lastPublishDate">Крайняя дата публикации: {{ lastPublishDate }}</div>
			</div>
			<div class="posts__select flex w-1/2 gap-2.5">
				<v-select
					clearable
					label="Канал"
					v-model="form.channel"
					:items="formattedChannels"
					variant="outlined"
					@update:model-value="updateChannel"
				></v-select>
				<v-select
					clearable
					label="Статус просмотра"
					v-model="form.watched"
					:items="watchedOptions"
					variant="outlined"
					@update:model-value="updateWatched"
				></v-select>
			</div>
		</div>

		<div
			class="posts__post"
			v-for="post in postsList"
			:key="post.id"
		>
			<postCard
				:post="post"
				@delete-post="delPost"
				@publish-instantly-post="publishInstantlyPost"
			/>
		</div>

		<div
			class="posts__pagination flex justify-center items-center my-5"
			v-if="postsList.length"
		>
			<button
				@click="setPage(1)"
				:disabled="form.currentPage === 1"
				class="bg-gray-200 border border-gray-300 text-gray-800 py-2 px-3 mx-0.5 cursor-pointer transition-colors duration-300 hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 rounded disabled:opacity-60 disabled:cursor-not-allowed"
			></button>
			<button
				v-for="pageNumber in visiblePages"
				:key="pageNumber"
				@click="setPage(pageNumber)"
				:class="{
					'bg-blue-500 text-white border-blue-500': pageNumber === form.currentPage
				}"
				class="bg-gray-200 border border-gray-300 text-gray-800 py-2 px-3 mx-0.5 cursor-pointer transition-colors duration-300 hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 rounded"
			>
				{{ pageNumber }}
			</button>
			<button
				@click="setPage(lastPage)"
				:disabled="form.currentPage === lastPage"
				class="bg-gray-200 border border-gray-300 text-gray-800 py-2 px-3 mx-0.5 cursor-pointer transition-colors duration-300 hover:bg-gray-300 hover:text-gray-600 hover:border-gray-400 rounded disabled:opacity-60 disabled:cursor-not-allowed"
			>
				>>
			</button>
			<mainSelect
				class="posts__select-watched mr-5"
				:options="perPage"
				v-model="form.postsPerPage"
				@onChange="updatePostsPerPage"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { computed, onMounted } from 'vue';
	import { deletePost, publishInstantly, useSettings, usePosts } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { storeToRefs } from 'pinia';
	import { PostCard, MainSelect } from '@/widgets';
	import { watchedOptions, perPage } from '@/entities';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);
	const toast = useToast();
	const editorStore = usePosts();
	const { postsList, totalCount, publishTime, form } = storeToRefs(editorStore);

	const setPage = (page: number) => {
		editorStore.setStateValueByKey('form', { ...form.value, currentPage: page });
		editorStore.getPosts();
	};

	const updatePostsPerPage = async (value) => {
		editorStore.setStateValueByKey('form', {
			...form.value,
			postsPerPage: parseInt(value.value, 10),
			currentPage: 1
		});
		editorStore.getPosts();
	};

	const delPost = async (id: number) => {
		try {
			if (!confirm('Вы уверены, что хотите удалить пост?')) {
				return;
			}
			editorStore.setStateValueByKey('isLoader', true);
			const result = await deletePost(id);
			toast.success(result);
			editorStore.getPosts();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			editorStore.setStateValueByKey('isLoader', false);
		}
	};

	const publishInstantlyPost = async (id: number) => {
		try {
			if (!confirm('Вы уверены, что хотите опубликовать пост?')) {
				return;
			}
			editorStore.setStateValueByKey('isLoader', true);
			const result = await publishInstantly(id);
			toast.success(result);
			editorStore.getPosts();
		} catch (e: any) {
			toast.error(e.response.data.message);
		} finally {
			editorStore.setStateValueByKey('isLoader', false);
		}
	};

	const lastPage = computed(() => {
		return Math.ceil(totalCount.value / form.value.postsPerPage);
	});

	const visiblePages = computed(() => {
		const maxVisiblePages = 10; // Максимальное количество отображаемых страниц
		const totalPages = Math.ceil(totalCount.value / form.value.postsPerPage);
		let startPage = 1;
		let endPage = totalPages;

		if (totalPages > maxVisiblePages) {
			const half = Math.floor(maxVisiblePages / 2);
			startPage = Math.max(form.value.currentPage - half, 1);
			endPage = startPage + maxVisiblePages - 1;

			if (endPage > totalPages) {
				endPage = totalPages;
				startPage = endPage - maxVisiblePages + 1;
			}
		}

		return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	});

	const lastPublishDate = computed(() => {
		if (!publishTime.value.length) return '';

		const postsPerDay = publishTime.value.length;
		const totalDays = Math.ceil(totalCount.value / postsPerDay);

		const startDate = new Date();
		const lastPostDate = new Date(startDate);
		lastPostDate.setDate(startDate.getDate() + totalDays);

		return lastPostDate.toLocaleDateString();
	});

	const updateWatched = (value: string) => {
		localStorage.setItem('watched', value);
		editorStore.setStateValueByKey('form', { ...form.value, watched: value });
		editorStore.getPosts();
	};

	const updateChannel = (value: string) => {
		localStorage.setItem('channel', value);
		editorStore.setStateValueByKey('form', { ...form.value, channel: value });
		editorStore.getPosts();
	};

	onMounted(() => {
		const watched = localStorage.getItem('watched') || '';
		const channel = localStorage.getItem('channel') || '';
		editorStore.setStateValueByKey('form', { ...form.value, watched, channel });
		editorStore.getPosts();
	});

	const formattedChannels = computed(() => {
		if (!listChannels.value) return;
		const channelsArray = listChannels.value.map((channel) => ({
			title: channel.name,
			value: channel.id.toString()
		}));

		return [{ title: 'Нечего', value: '' }, ...channelsArray];
	});
</script>
