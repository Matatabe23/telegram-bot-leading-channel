import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import {
    Home,
    PublishPage,
    Settings,
    PostData,
    Profile,
    Roles
} from '@/pages';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home
    },

    {
        path: '/publishing-page',
        component: PublishPage
    },

    {
        path: '/settings',
        component: Settings
    },
    {
        name: 'Пост',
        path: '/post/:id',
        component: PostData,
    },
    {
        path: '/profile',
        component: Profile,
    },
    {
        path: '/roles',
        component: Roles,
    },

    {
        path: '/:catchAll(.*)',
        redirect: '/not-found'
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});
