<template>
	<v-dialog
		v-model="dialog"
		width="400"
	>
		<template #activator="{ props }">
			<span
				v-bind="props"
				@click.stop="open"
                class="w-full md:w-auto"
			>
				<slot />
			</span>
		</template>

		<v-card>
			<v-card-title class="text-h6">
				<div class="break-normal whitespace-normal text-center">
					{{ confirmText }}
				</div>
			</v-card-title>
			<v-card-actions>
				<v-spacer />
				<v-btn
					@click="dialog = false"
					text
					>Отмена</v-btn
				>
				<v-btn
					color="red"
					text
					@click="handleConfirm"
					>Подтвердить</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
	import { ref } from 'vue';

	const props = defineProps({
		onConfirm: Function,
		confirmParams: {
			type: [Object, String, Number, Array, Boolean],
			default: null
		},
		confirmText: {
			type: String,
			default: 'Вы уверены?'
		}
	});

	const dialog = ref(false);

	const open = () => {
		dialog.value = true;
	};

	const handleConfirm = () => {
		dialog.value = false;
		props.onConfirm?.(props.confirmParams);
	};
</script>
