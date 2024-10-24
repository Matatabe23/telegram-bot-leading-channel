<template>
	<div class="fixed inset-0 flex items-center justify-center w-full h-full z-[100] bg-black/20">
		<div
			ref="modalContent"
			:class="modalClass ? modalClass : 'bg-white'"
			class="w-full h-screen md:h-auto md:max-w-[510px] flex flex-col md:grid gap-5 md:rounded-2xl p-3 lg:p-6 md:gap-6 lg:gap-8"
		>
			<div class="flex justify-between gap-4">
				<h3
					v-if="title"
					class="text-xl font-bold md:text-2xl lg:text-3xl"
				>
					{{ title }}
				</h3>
				<button @click="$emit('close')">
					<Icons
						:class="iconClass"
						icon="CROSS"
					/>
				</button>
			</div>
			<div
				class="grid gap-3 md:gap-6"
				:class="contentClass"
			>
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from 'vue';
	import { Icons } from '@/shared';
	import { bodyLock } from '@/shared/helpers';

	withDefaults(
		defineProps<{
			title?: string;
			contentClass?: string;
			modalClass?: string;
			iconClass?: string;
		}>(),
		{
			title: '',
			contentClass: '',
			modalClass: '',
			iconClass: ''
		}
	);

	defineEmits(['close']);

	const modalContent = ref<HTMLDivElement | null>(null);

	onMounted(() => bodyLock(false));

	onUnmounted(() => bodyLock(true));
</script>
