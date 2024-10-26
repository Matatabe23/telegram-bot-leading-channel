<template>
	<div class="dropdown-select">
		<select
			:model-value="props.modelValue.toString()"
			@change="handleChange"
			ref="dropdown"
		>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.label }}
			</option>
		</select>
	</div>
</template>

<script lang="ts" setup>
	interface IOptionsFromSelect {
		value: string;
		label: string;
	}

	const props = defineProps<{
		modelValue: string | number;
		options: IOptionsFromSelect[];
	}>();

	const emit = defineEmits<{
		'on-change': [value: IOptionsFromSelect];
	}>();

	const handleChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const selectedValue = target.value;

		const selectedOption = props.options.find((option) => option.value === selectedValue);

		if (!selectedOption) return;
		emit('on-change', selectedOption);
	};
</script>

<style scoped>
	.dropdown-select select {
		transition: all 0.3s ease-in-out;
		padding: 8px 18px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
