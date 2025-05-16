import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import EmployeesPage from '@/pages/EmployeesPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Employees',
    component: EmployeesPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router