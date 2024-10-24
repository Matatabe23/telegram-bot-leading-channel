import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import {
    Home,
} from '@/pages';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home
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
