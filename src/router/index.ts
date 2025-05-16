import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import EmployeesPage from '@/pages/EmployeesPage.vue'
import EmployeesForm from '@/components/employees/EmployeesForm.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/employees'
  },
  {
    path: '/employees',
    name: 'Employees',
    component: EmployeesPage
  },
  {
    path: '/employees/new',
    name: 'EmployeeCreate',
    component: EmployeesForm
  },
  {
    path: '/employees/:id/edit',
    name: 'EmployeeEdit',
    component: EmployeesForm,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
