<template>
	<component :is="Icons[icon]" />
</template>

<script lang="ts" setup>
	import { defineAsyncComponent } from 'vue';

	const LOGO_BIG = defineAsyncComponent(async () => await import('./icons/logoBig.vue'));
	const VK = defineAsyncComponent(async () => await import('./icons/vk.vue'));
	const VK_GRAY = defineAsyncComponent(async () => await import('./icons/vkGray.vue'));
	const TG_GRAY = defineAsyncComponent(async () => await import('./icons/tgFill.vue'));
	const VK_BLUE = defineAsyncComponent(async () => await import('./icons/vkBlue.vue'));
	const WHATSAPP = defineAsyncComponent(async () => await import('./icons/whatsapp.vue'));
	const CLASSMATES = defineAsyncComponent(async () => await import('./icons/classmates.vue'));
	const CLASSMATES_GREEN = defineAsyncComponent(
		async () => await import('./icons/classmatesGreen.vue')
	);
	const TELEGRAM = defineAsyncComponent(async () => await import('./icons/telegram.vue'));
	const SEARCH = defineAsyncComponent(async () => await import('./icons/search.vue'));
	const CROSS = defineAsyncComponent(async () => await import('./icons/cross.vue'));
	const YANDEX = defineAsyncComponent(async () => await import('./icons/yandex.vue'));
	const GOOGLE = defineAsyncComponent(async () => await import('./icons/google.vue'));
	const MAILRU = defineAsyncComponent(async () => await import('./icons/mailru.vue'));
	const EYE_CLOSE = defineAsyncComponent(async () => await import('./icons/eyeClose.vue'));
	const EYE = defineAsyncComponent(async () => await import('./icons/eye.vue'));
	const ARROW_STROKE = defineAsyncComponent(async () => await import('./icons/arrowStroke.vue'));
	const CHECKMARK = defineAsyncComponent(async () => await import('./icons/checkmark.vue'));
	const PROFILE = defineAsyncComponent(async () => await import('./icons/profile.vue'));
	const REVIEWS = defineAsyncComponent(async () => await import('./icons/reviews.vue'));
	const FAVOURITES = defineAsyncComponent(async () => await import('./icons/favourites.vue'));
	const EXIT = defineAsyncComponent(async () => await import('./icons/exit.vue'));
	const PHOTO_CAMERA = defineAsyncComponent(async () => await import('./icons/photoCamera.vue'));
	const ADD_DATA = defineAsyncComponent(async () => await import('./icons/addData.vue'));
	const PENCIL = defineAsyncComponent(async () => await import('./icons/pencil.vue'));
	const MINI_CROSS = defineAsyncComponent(async () => await import('./icons/miniCross.vue'));
	const PHOTO = defineAsyncComponent(async () => await import('./icons/photo.vue'));
	const STOCKS = defineAsyncComponent(async () => await import('./icons/stocks.vue'));
	const ADS = defineAsyncComponent(async () => await import('./icons/ads.vue'));
	const VACANCY = defineAsyncComponent(async () => await import('./icons/vacancy.vue'));
	const RESPONSE = defineAsyncComponent(async () => await import('./icons/response.vue'));
	const SETTING = defineAsyncComponent(async () => await import('./icons/setting.vue'));
	const MAP = defineAsyncComponent(async () => await import('./icons/map.vue'));
	const FLAG = defineAsyncComponent(async () => await import('./icons/flag.vue'));
	const STAR = defineAsyncComponent(async () => await import('./icons/star.vue'));
	const THUMB = defineAsyncComponent(async () => await import('./icons/thumb.vue'));
	const CHECKMARK_BLUE = defineAsyncComponent(
		async () => await import('./icons/checkmarkBlue.vue')
	);
	const USER_DELETE = defineAsyncComponent(async () => await import('./icons/userX.vue'));
	const CLOSE = defineAsyncComponent(async () => await import('./icons/close.vue'));
	const CIRCLE_CHECK = defineAsyncComponent(async () => await import('./icons/circleCheck.vue'));
	const MENU = defineAsyncComponent(async () => await import('./icons/menu.vue'));
	const MAIL = defineAsyncComponent(async () => await import('./icons/mail.vue'));
	const SHARE = defineAsyncComponent(async () => await import('./icons/share.vue'));
	const SORT = defineAsyncComponent(async () => await import('./icons/sort.vue'));
	const PIN = defineAsyncComponent(async () => await import('./icons/pin.vue'));
	const READ = defineAsyncComponent(async () => await import('./icons/read.vue'));
	const THREE_POINT_MENU = defineAsyncComponent(
		async () => await import('./icons/threePointMenu.vue')
	);
	const PAPERCLIP = defineAsyncComponent(async () => await import('./icons/paperclip.vue'));
	const PAPER_AIRPLANE = defineAsyncComponent(
		async () => await import('./icons/paperAirplane.vue')
	);
	const SLASH_CIRCLE = defineAsyncComponent(async () => await import('./icons/slashCircle.vue'));
	const MARKER = defineAsyncComponent(async () => await import('./icons/marker.vue'));
	const SHIELD = defineAsyncComponent(async () => await import('./icons/shield.vue'));
	const MESSADGE_X_SQUARE = defineAsyncComponent(
		async () => await import('./icons/messageXSquare.vue')
	);
	const USER_SQUARE = defineAsyncComponent(async () => await import('./icons/userSquare.vue'));
	const TRASH = defineAsyncComponent(async () => await import('./icons/trash.vue'));
	const TOOL = defineAsyncComponent(async () => await import('./icons/tool.vue'));
	const SITE = defineAsyncComponent(async () => await import('./icons/site.vue'));
	const FILTER = defineAsyncComponent(async () => await import('./icons/filter.vue'));
	const FILE = defineAsyncComponent(async () => await import('./icons/file.vue'));
	const EDIT_PENCIL = defineAsyncComponent(async () => await import('./icons/editPencil.vue'));
	const CHEVRON_LEFT = defineAsyncComponent(async () => await import('./icons/chevronLeft.vue'));
	const MENU_TWO_STRIPES = defineAsyncComponent(
		async () => await import('./icons/menuTwoStripes.vue')
	);
	const CAMERA = defineAsyncComponent(async () => await import('./icons/camera.vue'));

	const Icons = {
		TG_GRAY,
		VK_GRAY,
		SITE,
		TOOL,
		TRASH,
		USER_SQUARE,
		MESSADGE_X_SQUARE,
		SHIELD,
		MARKER,
		SLASH_CIRCLE,
		LOGO_BIG,
		VK,
		VK_BLUE,
		WHATSAPP,
		CLASSMATES,
		TELEGRAM,
		SEARCH,
		CROSS,
		YANDEX,
		GOOGLE,
		MAILRU,
		CLASSMATES_GREEN,
		EYE_CLOSE,
		EYE,
		ARROW_STROKE,
		CHECKMARK,
		PROFILE,
		REVIEWS,
		FAVOURITES,
		EXIT,
		PHOTO_CAMERA,
		ADD_DATA,
		PENCIL,
		MINI_CROSS,
		PHOTO,
		STOCKS,
		ADS,
		VACANCY,
		RESPONSE,
		SETTING,
		MAP,
		STAR,
		FLAG,
		CHECKMARK_BLUE,
		THUMB,
		USER_DELETE,
		CLOSE,
		CIRCLE_CHECK,
		MENU,
		MAIL,
		SHARE,
		SORT,
		PIN,
		READ,
		THREE_POINT_MENU,
		PAPERCLIP,
		PAPER_AIRPLANE,
		FILTER,
		FILE,
		EDIT_PENCIL,
		CHEVRON_LEFT,
		MENU_TWO_STRIPES,
		CAMERA
	};

	defineProps<{
		icon: keyof typeof Icons;
	}>();
</script>
