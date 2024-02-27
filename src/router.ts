import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      meta: { layout: "Auth" }
    },
    {
      path: '/users',
      component: () => import('@/views/User.vue')
    },
    {
      path: '/admins',
      component: () => import('@/views/Admin.vue')
    },
  ]
})

export default router
