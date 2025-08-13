<template>
	<div class="fixed inset-0 flex items-center justify-center w-full h-full z-[100]">
		<div
			ref="modalContent"
			:class="modalClass ? modalClass : 'md:max-w-[510px]'"
			class="relative z-10 flex flex-col w-full h-full gap-5 p-3 bg-white md:h-auto md:grid md:rounded-2xl lg:p-6 md:gap-6 lg:gap-8"
		>
			<div class="flex items-center gap-4 md:items-start md:justify-between">
				<Icons
					@click="$emit('close')"
					class="rotate-90 text-blue"
					:class="arrowRoute ? 'hidden' : 'md:hidden block'"
					icon="ARROW_STROKE"
				/>
				<div class="flex gap-4">
					<Icons
						v-if="arrowRoute"
						@click="customEmit ? $emit('custom-emit') : router.go(-1)"
						class="lg:h-8 lg:w-8 md:h-[26px] md:w-6 w-[20px] h-[22px] stroke-[3] rotate-90 cursor-pointer"
						icon="ARROW_STROKE"
					/>
					<h3
						v-if="title"
						class="text-base font-bold md:text-lg lg:text-2xl text-blue_dark"
					>
						{{ title }}
					</h3>
				</div>
				<button
					@click="$emit('close')"
					class="hidden md:block"
				>
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
		<div
			@click="$emit('close')"
			class="absolute md:block z-[9] inset-0 bg-black/20"
		></div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onBeforeUnmount } from 'vue';
	import { Icons } from '@/shared';
	import { bodyLock } from '@/shared/helpers';
	import { useRouter } from 'vue-router';

	const props = withDefaults(
		defineProps<{
			title?: string;
			contentClass?: string;
			modalClass?: string;
			iconClass?: string;
			dropList?: { title: string; value: string }[];
			arrowRoute?: boolean;
			hide?: boolean;
			customEmit?: boolean;
		}>(),
		{
			title: '',
			contentClass: '',
			modalClass: '',
			iconClass: '',
			hide: false
		}
	);

	const router = useRouter();

	defineEmits(['close', 'custom-emit']);

	onMounted(() => bodyLock(false));

	onBeforeUnmount(() => {
		if (props.hide) {
			bodyLock(true);
		}
	});
</script>
