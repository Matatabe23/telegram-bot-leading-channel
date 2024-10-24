<template>
	<v-app>
		<v-navigation-drawer
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
		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer">
				<Icons
					icon="MENU"
					class="h-6 w-6"
				/>
			</v-app-bar-nav-icon>
		</v-app-bar>
		<v-main>
			<slot></slot>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { Icons } from '@/shared';

	const router = useRouter();
	const drawer = ref(false);

	const goTo = (path: string) => {
		router.push(path);
		drawer.value = false;
	};

	const PAGES = [
		{
			title: 'Главная страница',
			path: '/'
		},
		{
			title: 'Настройки',
			path: '/'
		}
	];
</script>
