<template>
	<button
		:class="[
			buttonsNavigateClassList,
			{ 'lg:-left-[200px] md:-left-[90px] left-0': position === 'left' && sideButtons },
			{
				'translate-x-1/2 -left-8': position === 'left' && !sideButtons
			},
			{ 'lg:-right-[250px] md:-right-[90px] right-0': position === 'right' && sideButtons },
			{ '-translate-x-1/2 -right-8': position === 'right' && !sideButtons }
		]"
		class="w-[42px] h-[42px] md:w-[66px] md:h-[66px] hover:bg-wild-sand/70 -translate-y-1/2 absolute disabled:opacity-50 md:top-1/2 backdrop-blur-md transition-all duration-300 z-10 rounded-full flex items-center justify-center text-app-white bg-app-white/25"
	>
		<svg
			class="hidden md:block"
			width="35"
			height="16"
			viewBox="0 0 35 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M33.7696 8.70711C34.1601 8.31658 34.1601 7.68342 33.7696 7.29289L27.4056 0.928932C27.0151 0.538408 26.382 0.538408 25.9914 0.928932C25.6009 1.31946 25.6009 1.95262 25.9914 2.34315L31.6483 8L25.9914 13.6569C25.6009 14.0474 25.6009 14.6805 25.9914 15.0711C26.382 15.4616 27.0151 15.4616 27.4056 15.0711L33.7696 8.70711ZM0.0625 9H33.0625V7H0.0625V9Z"
				fill="currentColor"
			/>
		</svg>
		<svg
			class="md:hidden"
			width="23"
			height="16"
			viewBox="0 0 23 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M21.8907 8.70711C22.2812 8.31658 22.2812 7.68342 21.8907 7.29289L15.5267 0.928932C15.1362 0.538408 14.503 0.538408 14.1125 0.928932C13.722 1.31946 13.722 1.95262 14.1125 2.34315L19.7694 8L14.1125 13.6569C13.722 14.0474 13.722 14.6805 14.1125 15.0711C14.503 15.4616 15.1362 15.4616 15.5267 15.0711L21.8907 8.70711ZM0.183594 9H21.1836V7H0.183594V9Z"
				fill="currentColor"
			/>
		</svg>
	</button>
</template>

<script setup lang="ts">
	defineProps<{
		buttonsNavigateClassList: string;
		sideButtons: boolean;
		position: 'left' | 'right';
	}>();
</script>
