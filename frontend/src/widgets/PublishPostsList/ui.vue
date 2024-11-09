<template>
	<section class="w-11/12 relative mx-4">
		<div class="flex flex-col md:flex-row gap-4 md:gap-0 justify-between mb-2.5">
			<div class="mb-3 text-sm md:text-base">
				<div v-if="totalCount">Всего постов: {{ totalCount }}</div>
				<div v-if="lastPublishDate">Крайняя дата публикации: {{ lastPublishDate }}</div>
			</div>
			<div class="flex flex-col md:flex-row md:w-1/2 gap-2.5">
				<v-select
					label="Канал"
					v-model="form.channel"
					:items="formattedChannels"
					variant="outlined"
					@update:model-value="updateChannel"
					:disabled="appStore.isLoading"
					:loading="appStore.isLoading"
				></v-select>
				<v-select
					label="Статус просмотра"
					v-model="form.watched"
					:items="watchedOptions"
					variant="outlined"
					@update:model-value="updateWatched"
					:disabled="appStore.isLoading"
					:loading="appStore.isLoading"
				></v-select>
			</div>
		</div>

		<div
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
			class="flex justify-center items-center my-5"
			v-if="postsList.length"
		>
			<v-pagination
				v-model="form.currentPage"
				:length="lastPage"
				:total-visible="appStore.isMd ? 7 : 3"
				@update:model-value="setPage"
				:disabled="appStore.isLoading"
				class="text-xs"
			/>

			<mainSelect
				class="mr-5 hidden md:block"
				:options="perPage"
				v-model="form.postsPerPage"
				@onChange="updatePostsPerPage"
			/>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { computed, onMounted } from 'vue';
	import { deletePost, publishInstantly, useSettings, usePosts } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { storeToRefs } from 'pinia';
	import { PostCard, MainSelect } from '@/widgets';
	import { watchedOptions, perPage } from '@/entities';
	import { useAppStore } from '@/app/app.store';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);
	const toast = useToast();
	const editorStore = usePosts();
	const { postsList, totalCount, publishTime, form } = storeToRefs(editorStore);
	const appStore = useAppStore();

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
			appStore.isLoading = true;
			const result = await deletePost(id);
			toast.success(result);
			editorStore.getPosts();
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const publishInstantlyPost = async (id: number) => {
		try {
			if (!confirm('Вы уверены, что хотите опубликовать пост?')) {
				return;
			}
			appStore.isLoading = true;
			const result = await publishInstantly(id);
			toast.success(result);
			editorStore.getPosts();
		} catch (e: any) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const lastPage = computed(() => {
		return Math.ceil(totalCount.value / form.value.postsPerPage);
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
