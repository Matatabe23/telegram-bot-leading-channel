<template>
	<section class="w-full pb-32">
		<PaginationPostData
			:checkListImageLenght="state.checkListImage.length"
			v-model:useChannelList="state.form.useChannelList"
			@backPage="backPage"
			@delPost="delPost"
			@deleteSelectedImg="deleteSelectedImg"
			@updateChannelList="updateChannelList"
			@nextPage="nextPage"
		/>

		<div class="flex items-center justify-center flex-wrap gap-2 my-12">
			<div
				v-for="(photo, index) in state.images"
				:key="index"
				class="relative"
			>
				<img
					:src="photo.img"
					alt="Photo"
					class="h-[58vh] w-[45vh] object-contain rounded-lg"
					@load="checkImageLoaded"
				/>
				<v-checkbox
					class="absolute top-2 right-2"
					color="red"
					hide-details
					v-if="state.imagesToLoad < 1"
					:model-value="state.checkListImage.some((checkId) => checkId.id === photo.id)"
					@update:model-value="setValueSheckBox(photo)"
				/>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
	import { onMounted, reactive } from 'vue';
	import {
		receivingPost,
		deletePost,
		changePage,
		deleteSelectedImgs,
		editPostLinkСhannels
	} from '@/shared';
	import { useRoute, useRouter } from 'vue-router';
	import { useToast } from 'vue-toastification';
	import { PaginationPostData } from '@/widgets';
	import { useAppStore } from '@/app/app.store';
	import { EDirection } from './const';

	const route = useRoute();
	const router = useRouter();
	const toast = useToast();
	const appStore = useAppStore();

	const state = reactive({
		images: [],
		checkListImage: [],
		imagesToLoad: 0,

		form: {
			useChannelList: []
		}
	});

	const openPostPanel = async () => {
		try {
			appStore.isLoading = true;
			state.form.useChannelList = [];
			state.images = [];

			const response = await receivingPost(Number(route.params.id));
			state.images = response.imageList;
			state.form.useChannelList = response.channelsPost?.map((item) => item.id);
		} catch (e) {
			router.push('/publishing-panel');
			localStorage.setItem('watched', '');
			toast.error(e.response.data.message);
		} finally {
			state.imagesToLoad = state.images.length;
			if (state.imagesToLoad === 0) {
				appStore.isLoading = false;
			}
		}
	};

	const switchPostPanel = async (who: string) => {
		try {
			appStore.isLoading = false;
			state.form.useChannelList = [];
			state.images = [];
			const watched = localStorage.getItem('watched') || '';
			const channel = localStorage.getItem('channel') || '';

			const response = await changePage(Number(route.params.id), who, watched, channel);
			state.images = response.imageList;
			state.form.useChannelList = response.channelsPost?.map((item) => item.id);
			router.push(response.postId.toString());
		} catch (e) {
				router.push('/publishing-page');
				localStorage.setItem('watched', '');
				toast.error(e.response.data.message);
		} finally {
			state.imagesToLoad = state.images.length;
			if (state.imagesToLoad === 0) {
				appStore.isLoading = false;
			}
		}
	};

	const checkImageLoaded = () => {
		state.imagesToLoad--;
		if (state.imagesToLoad === 0) {
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
			toast.success(result);
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
		const event = state.checkListImage.some((checkId) => checkId.id === value.id);
		if (!event) {
			state.checkListImage.push(value);
		} else {
			state.checkListImage = state.checkListImage.filter((item) => item.id !== value.id);
		}
	};

	const deleteSelectedImg = async () => {
		try {
			if (state.checkListImage.length >= 1) {
				appStore.isLoading = true;
				await deleteSelectedImgs(state.checkListImage as any);
				openPostPanel();
			}
		} catch (e) {
			toast.error(e.response.data.message);
		} finally {
			appStore.isLoading = false;
			state.checkListImage = [];
		}
	};

	const updateChannelList = async () => {
		try {
			await editPostLinkСhannels(Number(route.params.id), state.form.useChannelList);
		} catch (e) {
			toast.error(e.response.data.message);
		}
	};

	onMounted(() => {
		openPostPanel();
	});
</script>
