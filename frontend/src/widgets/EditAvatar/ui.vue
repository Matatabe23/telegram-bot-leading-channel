<template>
	<div
		class="relative rounded-full overflow-hidden justify-self-center cursor-pointer"
		@mouseover="isHovered = true"
		@mouseleave="isHovered = false"
		@click="selectFile"
	>
		<img
			class="object-cover object-center w-full h-full"
			:src="model"
			alt="User Avatar"
			:style="{ opacity: isUploading ? 0.5 : 1 }"
		/>
		<div
			v-if="isHovered && !isUploading"
			class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm font-semibold"
		>
			<Icons
				icon="CAMERA"
				class="h-1/3 w-1/3"
			/>
		</div>

		<div
			v-if="isUploading"
			class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
		>
			<v-progress-circular
				indeterminate
				color="primary"
				size="70"
			/>
		</div>

		<input
			type="file"
			ref="fileInput"
			class="hidden"
			accept="image/*"
			@change="handleFileUpload"
		/>
	</div>
</template>

<script lang="ts" setup>
	import { Icons, uploadFilesToS3 } from '@/shared';
	import { ref } from 'vue';

	const props = defineProps<{
		fileName: string;
	}>();

	const model = defineModel<string>();
	const isHovered = ref(false);
	const isUploading = ref(false);
	const fileInput = ref<HTMLInputElement | null>(null);

	const selectFile = () => {
		fileInput.value?.click();
	};

	const handleFileUpload = async (event: any) => {
		const file = event.target.files[0];
		if (file) {
			isUploading.value = true;
			try {
				const image = await uploadFilesToS3(file, props.fileName);

				const img = new Image();
				img.src = image.data;

				img.onload = () => {
					model.value = image.data;
					isUploading.value = false;
				};
			} catch (error) {
				isUploading.value = false;
			} finally {
				fileInput.value!.value = '';
			}
		}
	};
</script>
