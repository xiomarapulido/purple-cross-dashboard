<script setup lang="ts">
import { reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Employee } from '@/types/Employee'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { ACTIONS, VALIDATION_MESSAGES, FIELD_LABELS, BUTTON_LABELS } from '@/constants/employeeFormConstants'
import { ROUTES } from '@/constants/routes'
import { EVENTS } from '@/constants/events'

const router = useRouter()
const route = useRoute()

const schema = yup.object({
  code: yup
    .string()
    .required('Code is required')
    .matches(/^[a-zA-Z0-9\-_\s]+$/, "Code contains invalid characters")
    .test(
      'unique-code',
      'This code is already in use',
      function(value) {
        if (!value) return true

        const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
        if (!employeesJson) return true

        const employees: Employee[] = JSON.parse(employeesJson)
        const currentId = route.params.id ? Number(route.params.id) : null

        const exists = employees.some(e => e.code === value && e.id !== currentId)
        return !exists
      }
    ),
  fullName: yup
    .string()
    .required('Full Name is required')
    .matches(/^[a-zA-Z\s]+$/, "Full Name contains invalid characters"),
  occupation: yup
    .string()
    .required('Occupation is required')
    .matches(/^[a-zA-Z\s]+$/, "Occupation contains invalid characters"),
  department: yup
    .string()
    .required('Department is required')
    .matches(/^[a-zA-Z\s]+$/, "Department contains invalid characters"),
  dateOfEmployment: yup.date().nullable(),
  terminationDate: yup.date().nullable(),
})

const formData = reactive<Employee>({
  id: 0,
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: null,
  terminationDate: null
})

const { handleSubmit, errors, resetForm } = useForm<Employee>({
  validationSchema: schema,
  initialValues: formData
})

watch(formData, (newVal) => {
  resetForm({ values: newVal })
}, { immediate: true, deep: true })

onMounted(() => {
  const idParam = route.params.id
  if (idParam) {
    const id = Number(idParam)
    const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
    if (!employeesJson) return
    const employees: Employee[] = JSON.parse(employeesJson)
    const employeeToEdit = employees.find(e => e.id === id)
    if (employeeToEdit) {
      Object.assign(formData, employeeToEdit)
    }
  }
})

const pageTitle = computed(() => (route.params.id ? ACTIONS.edit : ACTIONS.create))
const submitLabel = computed(() => (route.params.id ? ACTIONS.save : ACTIONS.createTetx))

const onSubmit = handleSubmit(() => {
  const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
  const employees: Employee[] = employeesJson ? JSON.parse(employeesJson) : []

  const employeeId = route.params.id ? Number(route.params.id) : Math.floor(Math.random() * 1000000)
  const newEmployee: Employee = { id: employeeId, ...formData }

  const index = employees.findIndex(e => e.id === employeeId)
  if (index >= 0) {
    employees[index] = newEmployee
  } else {
    employees.unshift(newEmployee)
  }
  localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees))

  window.dispatchEvent(new Event(EVENTS.employeesUpdated))

  router.push({ name: ROUTES.list })
})

function onCancel() {
  router.push({ name: ROUTES.list })
}
</script>

<template>
  <div class="container py-4">
    <h3>{{ pageTitle }}</h3>
    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-3">
        <label for="code">{{ FIELD_LABELS.code }}</label>
        <input
          id="code"
          v-model="formData.code"
          type="text"
          :class="['form-control', errors.code ? 'is-invalid' : '']"
        />
        <div class="invalid-feedback">{{ errors.code }}</div>
      </div>

      <div class="mb-3">
        <label for="fullName">{{ FIELD_LABELS.fullName }}</label>
        <input
          id="fullName"
          v-model="formData.fullName"
          type="text"
          :class="['form-control', errors.fullName ? 'is-invalid' : '']"
        />
        <div class="invalid-feedback">{{ errors.fullName }}</div>
      </div>

      <div class="mb-3">
        <label for="occupation">{{ FIELD_LABELS.occupation }}</label>
        <input
          id="occupation"
          v-model="formData.occupation"
          type="text"
          :class="['form-control', errors.occupation ? 'is-invalid' : '']"
        />
        <div class="invalid-feedback">{{ errors.occupation }}</div>
      </div>

      <div class="mb-3">
        <label for="department">{{ FIELD_LABELS.department }}</label>
        <input
          id="department"
          v-model="formData.department"
          type="text"
          :class="['form-control', errors.department ? 'is-invalid' : '']"
        />
        <div class="invalid-feedback">{{ errors.department }}</div>
      </div>

      <div class="mb-3">
        <label for="dateOfEmployment">{{ FIELD_LABELS.dateOfEmployment }}</label>
        <input
          id="dateOfEmployment"
          v-model="formData.dateOfEmployment"
          type="date"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label for="terminationDate">{{ FIELD_LABELS.terminationDate }}</label>
        <input
          id="terminationDate"
          v-model="formData.terminationDate"
          type="date"
          class="form-control"
        />
      </div>

      <div class="d-flex gap-2 justify-content-end">
        <button type="button" class="btn btn-secondary" @click="onCancel">
          {{ BUTTON_LABELS.cancel }}
        </button>
        <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
      </div>
    </form>
  </div>
</template>
