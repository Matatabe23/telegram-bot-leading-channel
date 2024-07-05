import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Component } from 'vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: (): Promise<Component> => import('@/views/Main.vue'),
  },
  {
    path: '/publishing-panel',
    component: (): Promise<Component> => import('@/views/publichingPanel/PublishPage.vue'),
  },
  {
    path: '/settings',
    component: (): Promise<Component> => import('@/views/settings/MainSettings.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
