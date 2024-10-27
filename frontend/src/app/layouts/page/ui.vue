<template>
	<v-app>
		<v-navigation-drawer
			v-if="!isHomePage"
			v-model="drawer"
			app
		>
			<v-list>
				<v-list-item
					v-for="page in PAGES"
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
							image="https://sun9-64.userapi.com/impg/1kaKP8ZEEjhzn2saJaG0qgQby7LfjtCpm6ruSA/V2yI81E-7UE.jpg?size=2048x2048&quality=95&sign=06a6df80d15224f5d549a969713d4843&type=album"
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
	import { Icons, useAuth } from '@/shared';

	const router = useRouter();
	const authStore = useAuth();

	const drawer = ref(false);

	const goTo = (path: string) => {
		router.push(path);
		drawer.value = false;
	};

	const PAGES = [
		{
			title: 'Главная страница',
			path: '/publishing-page'
		},
		{
			title: 'Настройки',
			path: '/settings'
		}
	];

	const isHomePage = computed(() => router.currentRoute.value.path === '/');

	const exit = async () => {
		localStorage.removeItem('admin');
		localStorage.removeItem('token');
		authStore.setStateValueByKey('auth', false);
		await router.push('/');
	};

	const MENU_LIST = [
		{
			title: 'Выйти',
			function: exit
		}
	];
</script>
