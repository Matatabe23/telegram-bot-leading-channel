import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Component } from 'vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: (): Promise<Component> => import('@/views/Main.vue'),
  },
  {
    name: 'Панель публикации',
    path: '/publishing-panel',
    component: (): Promise<Component> => import('@/views/publichingPanel/PublishPage.vue'),
  },
  {
    name: 'Пост',
    path: '/post/:id',
    component: (): Promise<Component> => import('@/views/post/postData.vue'),
  },
  {
    name: 'Настройки',
    path: '/settings',
    component: (): Promise<Component> => import('@/views/settings/MainSettings.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
