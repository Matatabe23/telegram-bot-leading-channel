import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '@/views/Main.vue';
import PublishingPanel from '@/views/PublishingPanel.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/publishing-panel',
    component: PublishingPanel
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
