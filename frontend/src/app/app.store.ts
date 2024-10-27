import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useWindowSize } from '@vueuse/core/index.cjs';

export const useAppStore = defineStore('app', () => {
	const { height, width } = useWindowSize();
	const isAuth = ref(false);
	const isLg = computed(() => width.value >= 1366);
	const isMd = computed(() => width.value >= 768);

	return { isLg, isMd, isAuth, width, height };
});
