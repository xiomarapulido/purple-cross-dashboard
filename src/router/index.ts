import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import EmployeesPage from '@/pages/EmployeesPage.vue'
import EmployeesForm from '@/components/employees/EmployeesForm.vue'
import { ROUTES } from '@/constants/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/employees'
  },
  {
    path: '/employees',
    name: ROUTES.list,
    component: EmployeesPage
  },
  {
    path: '/employees/new',
    name: ROUTES.create,
    component: EmployeesForm
  },
  {
    path: '/employees/:id/edit',
    name: ROUTES.edit,
    component: EmployeesForm
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
