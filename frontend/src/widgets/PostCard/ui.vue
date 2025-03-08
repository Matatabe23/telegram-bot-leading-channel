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
					<v-btn
						v-if="checkPermissions(appStore.data?.EPermissions?.DELETE_POSTS)"
						color="#5865f2"
						variant="flat"
						@click="emit('delete-post', props.post.id)"
						class="w-full md:w-auto"
						:loading="appStore.isLoading"
						>Удалить</v-btn
					>
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="router.push(`post/${props.post.id}`)"
						class="w-full md:w-auto"
						:loading="appStore.isLoading"
						>Открыть</v-btn
					>
					<v-btn
						v-if="checkPermissions(appStore.data?.EPermissions?.PUBLISH_POSTS)"
						color="#5865f2"
						variant="flat"
						@click="emit('publish-instantly-post', props.post.id)"
						class="w-full md:w-auto"
						:loading="appStore.isLoading"
						>Опубликовать</v-btn
					>
                    <v-btn
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
