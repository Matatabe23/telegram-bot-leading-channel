<template>
	<section class="publish-posts-list w-11/12 relative mx-4">
		<div class="flex justify-between mb-2.5">
			<div class="mb-3 text-sm md:text-base">
				<div v-if="totalCount">Всего постов: {{ totalCount }}</div>
				<div v-if="lastPublishDate">Крайняя дата публикации: {{ lastPublishDate }}</div>
			</div>
			<v-btn
				@click="isFilterModalOpen = true"
				variant="outlined"
				>Фильтры</v-btn
			>
		</div>

		<v-dialog
			v-model="isFilterModalOpen"
			max-width="500"
		>
			<v-card>
				<v-card-title>Фильтры</v-card-title>
				<v-card-text>
					<v-text-field
						label="Фильтр по айди"
						variant="outlined"
						v-model="search"
						@update:model-value="updateSearch"
						clearable
						:loading="appStore.isLoading"
					/>
					<v-select
						label="Канал"
						v-model="form.channel"
						:items="formattedChannels"
						variant="outlined"
						@update:model-value="updateChannel"
						:loading="appStore.isLoading"
					/>
					<v-select
						label="Статус просмотра"
						v-model="form.watched"
						:items="watchedOptions"
						variant="outlined"
						@update:model-value="updateWatched"
						:loading="appStore.isLoading"
					/>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="isFilterModalOpen = false">Закрыть</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog
			v-model="isPromtModalOpen"
			max-width="500"
		>
			<v-card>
				<v-card-text>{{ selectPromt || 'Отсутствуют :(' }}</v-card-text>
				<v-card-actions>
					<v-btn @click="isPromtModalOpen = false">Закрыть</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<div
			v-for="post in postsList"
			:key="post.id"
		>
			<postCard
				:post="post"
				@delete-post="delPost"
				@publish-instantly-post="publishInstantlyPost"
				@select-promt="setPromt"
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

			<div class="w-[80px] hidden md:block">
				<v-select
					class="publish-posts-list__none-message-select"
					v-model="form.postsPerPage"
					:items="perPage"
					variant="outlined"
					@update:model-value="updatePostsPerPage"
					:loading="appStore.isLoading"
				/>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { computed, onMounted, ref } from 'vue';
	import { deletePost, publishInstantly, useSettings, usePosts } from '@/shared';
	import { useToast } from 'vue-toastification';
	import { storeToRefs } from 'pinia';
	import { PostCard } from '@/widgets';
	import { watchedOptions, perPage } from '@/entities';
	import { useAppStore } from '@/app/app.store';
	import { useRoute, useRouter } from 'vue-router';
	import { useDebounceFn } from '@vueuse/core';

	const settingsStore = useSettings();
	const { listChannels } = storeToRefs(settingsStore);
	const toast = useToast();
	const editorStore = usePosts();
	const { postsList, totalCount, publishTime, form } = storeToRefs(editorStore);
	const appStore = useAppStore();
	const route = useRoute();
	const router = useRouter();

	const isFilterModalOpen = ref(false);
	const search = ref('');

	const isPromtModalOpen = ref(false);
	const selectPromt = ref('');

	const lastPage = computed(() => {
		return Math.ceil(totalCount.value / form.value.postsPerPage);
	});

	const formattedChannels = computed(() => {
		if (!listChannels.value) return;
		const channelsArray = listChannels.value.map((channel) => ({
			title: channel.name,
			value: channel.id.toString()
		}));

		return [{ title: 'Нечего', value: '' }, ...channelsArray];
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

	const setPromt = (value: string) => {
		isPromtModalOpen.value = true;
		selectPromt.value = value;
	};

	const setPage = (page: number) => {
		editorStore.setStateValueByKey('form', {
			...form.value,
			currentPage: page === 0 ? 1 : page
		});
		router.push({
			name: 'publishingPage',
			query: { ...route.query, page: page === 0 ? 1 : page }
		});
		editorStore.getPosts();
	};

	const updatePostsPerPage = async (value: number) => {
		editorStore.setStateValueByKey('form', {
			...form.value,
			postsPerPage: value,
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
			toast.success(result.message);
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
			toast.success(result.message);
			editorStore.getPosts();
		} catch (e: any) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const updateWatched = async (value: string) => {
		localStorage.setItem('watched', value);
		await editorStore.setStateValueByKey('form', { ...form.value, watched: value });
		await editorStore.getPosts();

		if (editorStore.postsList.length === 0) {
			await setPage(lastPage.value);
		}
	};

	const updateChannel = async (value: string) => {
		localStorage.setItem('channel', value);
		await editorStore.setStateValueByKey('form', { ...form.value, channel: value });
		await editorStore.getPosts();

		if (editorStore.postsList.length === 0) {
			await setPage(lastPage.value);
		}
	};

	const updateSearch = useDebounceFn(async (value: string) => {
		try {
			appStore.isLoading = true;
			await editorStore.setStateValueByKey('form', { ...form.value, search: value });
			await editorStore.getPosts();

			if (editorStore.postsList.length === 0) {
				await setPage(lastPage.value);
			}
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	}, 1000);

	onMounted(async () => {
		const watched = localStorage.getItem('watched') || '';
		const channel = localStorage.getItem('channel') || '';
		const currentPage = parseInt(route.query.page as string, 10) || 1;

		await editorStore.setStateValueByKey('form', {
			...form.value,
			watched,
			channel,
			currentPage
		});
		await editorStore.getPosts();

		if (editorStore.postsList.length === 0) {
			await setPage(lastPage.value);
		}
	});
</script>

<style scoped lang="scss">
	.publish-posts-list {
		&__none-message-select {
			.v-input__details {
				min-height: 0;
				height: 0;
				max-height: 0;
				padding: 0;
			}
			.v-messages {
				min-height: 0px;
				height: 0;
			}
		}
	}
</style>
