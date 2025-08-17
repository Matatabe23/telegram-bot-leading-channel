<template>
	<div class="border border-gray-300 rounded-lg bg-white mb-5 shadow-md relative">
		<div class="grid md:flex items-center gap-4 p-5">
			<img
				class="md:w-24 md:h-24 rounded-lg object-cover mb-2 md:md-0"
				v-for="img in props.post.images"
				:key="img.id"
				:src="img.image"
			/>
			<div>
				<h2 class="hidden md:block text-lg font-normal mb-2 text-gray-800">
					id: {{ props.post.id }}
				</h2>
				<div class="flex gap-2 flex-wrap md:flex-nowrap">
					<ConfirmAction
						v-if="checkPermissions(appStore.data?.EPermissions?.DELETE_POSTS)"
						:onConfirm="() => emit('delete-post', props.post.id)"
						confirmText="Вы уверены, что хотите удалить пост?"
					>
						<v-btn
							color="red"
							variant="flat"
							class="w-full md:w-auto"
							:loading="appStore.isLoading"
							>Удалить</v-btn
						>
					</ConfirmAction>

					<v-btn
						color="#5865f2"
						variant="flat"
						@click="router.push(`post/${props.post.id}`)"
						class="w-full md:w-auto"
						:loading="appStore.isLoading"
						>Открыть</v-btn
					>

					<ConfirmAction
						v-if="checkPermissions(appStore.data?.EPermissions?.PUBLISH_POSTS)"
						:onConfirm="() => emit('publish-instantly-post', props.post.id)"
						confirmText="Вы уверены, что хотите опубликовать пост?"
					>
						<v-btn
							v-if="checkPermissions(appStore.data?.EPermissions?.PUBLISH_POSTS)"
							color="green"
							variant="flat"
							class="w-full md:w-auto"
							:loading="appStore.isLoading"
							>Опубликовать</v-btn
						>
					</ConfirmAction>

					<v-btn
						v-if="props.post.promt"
						color="#5865f2"
						variant="flat"
						@click="emit('select-promt', props.post.promt)"
						class="w-full md:w-auto"
						:loading="appStore.isLoading"
						>Теги</v-btn
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { defineProps } from 'vue';
	import { useRouter } from 'vue-router';
	import { IPosts } from '@/entities';
	import { useAppStore } from '@/app/app.store';
	import { checkPermissions } from '@/shared';
	import { ConfirmAction } from '../ConfirmAction';

	const router = useRouter();
	const appStore = useAppStore();

	const props = defineProps<{
		post: IPosts;
	}>();

	const emit = defineEmits<{
		'delete-post': [value: number];
		'publish-instantly-post': [value: number];
		'select-promt': [value: string];
	}>();
</script>
