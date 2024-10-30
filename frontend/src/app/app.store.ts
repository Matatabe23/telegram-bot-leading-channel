import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useWindowSize } from '@vueuse/core/index.cjs';

export const useAppStore = defineStore('app', () => {
    const { height, width } = useWindowSize();
    const isLg = computed(() => width.value >= 1366);
    const isMd = computed(() => width.value >= 768);
    const isLoading = ref(true);

    const startLoading = () => {
        isLoading.value = true;
    };

    const stopLoading = () => {
        isLoading.value = false;
    };

    return { isLg, isMd, width, height, isLoading, startLoading, stopLoading };
});
