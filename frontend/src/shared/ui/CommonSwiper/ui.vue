<template>
	<div class="relative grid w-full">
		<Swiper
			:modules="swiperModules"
			:pagination="swiperPagination"
			:initialSlide="activeSlide"
			:autoplay="autoplayOptions"
			:navigation="swiperNavigation"
			:breakpoints="swiperProperties"
			:grabCursor="true"
			@swiper="swiper"
			class="grid w-full gap-3 grid-cols-full"
		>
			<SwiperSlide
				v-for="(slide, index) in slides"
				:key="index"
				:class="sliderClass"
				class="w-full h-full bg-center bg-no-repeat bg-cover"
				v-lazy:background-image="
					slide.includes('data:image') ? slide : `${slide}.${photoType}`
				"
			>
			</SwiperSlide>
		</Swiper>
		<template v-if="pagination">
			<div
				class="absolute font-medium text-white swiper-pagination -bottom-20 left-1/2 lg:text-xl xl:text-2xl md:text-l"
			></div>
		</template>
		<template v-if="navigation">
			<SwiperNavigateButton
				:class="navigation.prevEl"
				:buttonsNavigateClassList="'rotate-180 ' + buttonsNavigateClassList"
				position="left"
				:sideButtons="sideButtons"
			/>

			<SwiperNavigateButton
				:class="navigation.nextEl"
				position="right"
				:buttonsNavigateClassList="buttonsNavigateClassList"
				:sideButtons="sideButtons"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { Swiper, SwiperSlide } from 'swiper/vue';
	import type { AutoplayOptions } from 'swiper/types';
	import { Navigation, Autoplay, Pagination } from 'swiper/modules';
	import { ref } from 'vue';
	import { SwiperNavigateButton } from '@/shared';

	const props = defineProps<{
		slides: string[];
		photoType: 'webp' | 'png' | 'jpg';
		sliderClass?: string;
		activeSlide?: number;
		properties?: object;
		sideButtons?: boolean;
		buttonsNavigateClassList?: string;
		navigation?: {
			nextEl: string;
			prevEl: string;
		};
		pagination?: object;
	}>();

	const swiperPagination = ref(
		props.pagination || {
			el: '.swiper-pagination',
			type: 'bullet'
		}
	);
	const swiperNavigation = ref({
		nextEl: `.` + props.navigation.nextEl,
		prevEl: `.` + props.navigation.prevEl
	});

	const swiperProperties = ref(
		props.properties || {
			1920: {
				spaceBetween: 24,
				slidesPerView: 4
			},
			1366: {
				spaceBetween: 24,
				slidesPerView: 3.5
			},
			768: {
				spaceBetween: 24,
				slidesPerView: 2.5
			},
			320: {
				spaceBetween: 12,
				slidesPerView: 1.5
			}
		}
	);

	const swiperModules = [Navigation, Autoplay, Pagination];

	const autoplayOptions: AutoplayOptions = {
		delay: 4000,
		disableOnInteraction: false
	};

	const swiper = (swiper) => {
		swiper.value = swiper;
	};
</script>
