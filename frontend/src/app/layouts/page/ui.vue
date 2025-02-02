<template>
	<v-app>
		<v-navigation-drawer
			v-if="!isHomePage"
			v-model="drawer"
			app
		>
			<v-list>
				<v-list-item
					v-for="page in visiblePages"
					:key="page.title"
					link
					@click="goTo(page.path)"
				>
					<v-list-item-content>
						<v-list-item-title>{{ page.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar
			v-if="!isHomePage"
			app
		>
			<v-app-bar-nav-icon @click="drawer = !drawer">
				<Icons
					icon="MENU"
					class="h-6 w-6"
				/>
			</v-app-bar-nav-icon>
			<div class="ml-auto mr-4 cursor-pointer">
				<v-menu location="bottom">
					<template v-slot:activator="{ props }">
						<v-avatar
							v-bind="props"
							:image="appStore.userData.avatarUrl || 'https://api.dicebear.com/9.x/bottts/svg'"
						></v-avatar>
					</template>

					<v-list class="mt-2">
						<v-list-item
							@click="item.function"
							v-for="(item, index) in MENU_LIST"
							:key="index"
						>
							<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
		</v-app-bar>

		<v-main>
			<slot></slot>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useRouter } from 'vue-router';
	import { checkPermissions, Icons } from '@/shared';
	import { useAppStore } from '@/app/app.store';

	const router = useRouter();
	const appStore = useAppStore();

	const drawer = ref(false);

	const goTo = (path: string) => {
		router.push(path);
	};

	const PAGES = [
		{
			title: 'Главная страница',
			path: '/publishing-page',
			visible: true 
		},
		{
			title: 'Аккаунты',
			path: '/users',
			visible: checkPermissions(appStore.data?.EPermissions?.EDIT_USERS)
		},
		{
			title: 'Роли',
			path: '/roles',
			visible: checkPermissions(appStore.data?.EPermissions?.EDIT_ROLES)
		},
        {
			title: 'Реклама',
			path: '/advertisement',
			visible: checkPermissions(appStore.data?.EPermissions?.EDIT_ADVERTISEMENTS)
		},
		{
			title: 'Настройки',
			path: '/settings',
			visible: checkPermissions(appStore.data?.EPermissions?.CREATE_CHANNEL) || checkPermissions(appStore.data?.EPermissions?.SET_PUBLICATION_TIME)
		}
	];

	const isHomePage = computed(() => router.currentRoute.value.path === '/');
    const visiblePages = computed(() => PAGES.filter(page => page.visible));


	const exit = async () => {
		localStorage.removeItem('user');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		appStore.auth = false;
		await router.push('/');
	};

	const MENU_LIST = [
		{
			title: 'Профиль',
			function: () => router.push('/profile')
		},
		{
			title: 'Выйти',
			function: exit
		}
	];
</script>
