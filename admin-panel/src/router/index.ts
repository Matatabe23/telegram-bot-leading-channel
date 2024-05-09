import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '@/views/Main.vue';

import PublishingPanel from '@/views/publichingPanel/PublishingPanel.vue';

import MainSettings from '@/views/settings/MainSettings.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/publishing-panel',
    component: PublishingPanel
  },
  {
    path: '/settings',
    component: MainSettings
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
