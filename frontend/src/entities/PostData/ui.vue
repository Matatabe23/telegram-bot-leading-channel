<template>
	<section class="post-data w-full pb-32 md:pb-0">
		<PaginationPostData
			:checkListImageLenght="checkListImage.length"
			v-model:useChannelList="useChannelList"
			@backPage="backPage"
			@delPost="delPost"
			@deleteSelectedImg="deleteSelectedImg"
			@updateChannelList="updateChannelList"
			@nextPage="nextPage"
		/>

		<div class="flex items-center justify-center flex-wrap gap-2 my-12">
			<div
				v-for="(photo, index) in images"
				:key="index"
				class="relative"
			>
				<v-skeleton-loader class="post-data__image-skelet" v-show="imagesToLoad > 1" type="image"></v-skeleton-loader>
				<div v-show="imagesToLoad <= 0">
					<img
						:src="photo.img"
						alt="Photo"
						class="h-[58vh] object-contain rounded-lg"
						@load="checkImageLoaded"
					/>
					<v-checkbox
						class="absolute top-2 right-2 bg-white px-2 rounded-lg"
						color="red"
						hide-details
						v-if="
							imagesToLoad < 1 &&
							checkPermissions(appStore.data?.EPermissions?.DELETE_POSTS)
						"
						:model-value="checkListImage.some((checkId) => checkId.id === photo.id)"
						@update:model-value="setValueSheckBox(photo)"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { onMounted, ref } from 'vue';
	import { receivingPost, deletePost, changePage, checkPermissions, updatePosts } from '@/shared';
	import { useRoute, useRouter } from 'vue-router';
	import { useToast } from 'vue-toastification';
	import { PaginationPostData } from '@/widgets';
	import { useAppStore } from '@/app/app.store';
	import { EDirection } from './const';
	import { debounce } from 'lodash';

	const route = useRoute();
	const router = useRouter();
	const toast = useToast();
	const appStore = useAppStore();

	const images = ref([]);
	const checkListImage = ref([]);
	const imagesToLoad = ref(0);
	const useChannelList = ref([]);

	const saveData = (values: any) => {
		images.value = values.imageList;
		useChannelList.value = values.post.channels?.map((item) => item.id);
	};

	const openPostPanel = async () => {
		try {
			appStore.isLoading = true;
			useChannelList.value = [];
			images.value = [];

			const response = await receivingPost(Number(route.params.id));
			await saveData(response.data);
		} catch (e) {
			router.push('/publishing-panel');
			localStorage.setItem('watched', '');
			toast.error(e.response.data.message);
		} finally {``
			imagesToLoad.value = images.value?.length;
			if (imagesToLoad.value === 0) {
				appStore.isLoading = false;
			}
		}
	};

	const switchPostPanel = async (who: string) => {
		try {
			appStore.isLoading = false;
			useChannelList.value = [];
			images.value = [];
			const watched = localStorage.getItem('watched') || '';
			const channel = localStorage.getItem('channel') || '';

			const response = await changePage(Number(route.params.id), who, watched, channel);
			images.value = response.imageList;
			useChannelList.value = response.channelsPost?.map((item) => item.id);
			checkListImage.value = [];
			router.push(response.postId.toString());
		} catch (e) {
			router.push('/publishing-page');
			localStorage.setItem('watched', '');
			toast.error(e.response.data.message);
		} finally {
			imagesToLoad.value = images.value.length;
			if (imagesToLoad.value === 0) {
				appStore.isLoading = false;
			}
		}
	};

	const checkImageLoaded = () => {
		imagesToLoad.value--;
		if (imagesToLoad.value === 0) {
			appStore.isLoading = false;
		}
	};

	const delPost = async () => {
		try {
			if (!confirm('Вы уверены, что хотите удалить пост?')) {
				return;
			}
			appStore.isLoading = true;
			const result = await deletePost(Number(route.params.id));
			nextPage();
			toast.success(result?.message);
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
		}
	};

	const backPage = async () => {
		switchPostPanel(EDirection.BACK);
	};

	const nextPage = async () => {
		switchPostPanel(EDirection.NEXT);
	};

	const setValueSheckBox = async (value: any) => {
		const event = checkListImage.value.some((checkId) => checkId.id === value.id);
		if (!event) {
			checkListImage.value.push(value);
		} else {
			checkListImage.value = checkListImage.value.filter((item) => item.id !== value.id);
		}
	};

	const deleteSelectedImg = async () => {
		try {
			if (checkListImage.value.length >= 1) {
				appStore.isLoading = true;
				const response = await updatePosts({
					id: Number(route.params.id),
					images: checkListImage.value
				});
				saveData(response.data);
			}
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
			checkListImage.value = [];
		}
	};

	const updateChannelList = debounce(async () => {
		try {
			appStore.isLoading = true;
			const response = await updatePosts({
				id: Number(route.params.id),
				channelIds: useChannelList.value
			});
			toast.success(response?.message);
		} catch (e) {
			toast.error(e.response?.data?.message || 'Ошибка обновления');
		} finally {
			appStore.isLoading = false;
		}
	}, 600);

	onMounted(() => {
		openPostPanel();
	});
</script>

<style lang="scss">
.post-data{
    &__image-skelet{
        .v-skeleton-loader__image{
            @apply h-[58vh] w-[26vw]
        }
    }
}
</style>
