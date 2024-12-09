import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import {
    Home,
    PublishPage,
    Settings,
    PostData,
    Profile,
    Roles,
    Users
} from '@/pages';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Home
    },

    {
        path: '/publishing-page',
        name: 'publishingPage',
        component: PublishPage,
        props: (route) => ({ page: route.query.page || 1 })
    },

    {
        path: '/settings',
        component: Settings
    },
    {
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
        path: '/users',
        component: Users,
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
