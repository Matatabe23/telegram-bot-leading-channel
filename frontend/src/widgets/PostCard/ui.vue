<template>
	<div class="post border border-gray-300 rounded-lg bg-white mb-5 shadow-md">
		<div class="post__post-content flex items-center p-5">
			<div class="post__post-images mr-5">
				<img
					class="post__post-image w-24 h-24 rounded-lg object-cover"
					v-for="img in props.post.imageData"
					:key="img.id"
					:src="img.image"
					alt=""
				/>
			</div>
			<div class="post__post-details">
				<h2 class="post__post-title text-lg font-normal mb-2 text-gray-800">
					id: {{ props.post.id }}
				</h2>
				<div class="post__controle-buttons flex gap-2">
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="emit('delete-post', props.post.id)"
						>Удалить</v-btn
					>
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="router.push(`post/${props.post.id}`)"
						>Открыть</v-btn
					>
					<v-btn
						color="#5865f2"
						variant="flat"
						@click="emit('publish-instantly-post', props.post.id)"
						>Опубликовать</v-btn
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

	const router = useRouter();

	const props = defineProps<{
		post: IPosts;
	}>();

	const emit = defineEmits<{
		'delete-post': [value: number];
		'publish-instantly-post': [value: number];
	}>();
</script>

<style lang="scss">
	.post {
		&__post-title {
			@apply text-lg font-normal mb-2 text-gray-800;
		}

		&__post-images img {
			@apply w-24 h-24 rounded-lg object-cover;
		}

		&__controle-buttons {
			@apply flex gap-2;
		}
	}
</style>
