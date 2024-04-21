import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Authorization from '@/views/Authorization.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Authorization
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
