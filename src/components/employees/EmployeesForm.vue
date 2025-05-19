<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEmployeeForm } from '@/composables/useEmployeeForm'
import { ACTIONS, VALIDATION_MESSAGES, FIELD_LABELS, BUTTON_LABELS } from '@/constants/employeeFormConstants'
import { ROUTES } from '@/constants/routes'
import { EVENTS } from '@/constants/events'


const router = useRouter()
const route = useRoute()
const { formData, errors, handleSubmit, saveEmployee } = useEmployeeForm()

const pageTitle = computed(() => (route.params.id ? ACTIONS.edit : ACTIONS.create))
const submitLabel = computed(() => (route.params.id ? ACTIONS.save : ACTIONS.createTetx))

const onSubmit = handleSubmit(() => {
  const employeeId = route.params.id ? Number(route.params.id) : Math.floor(Math.random() * 1000000)
  saveEmployee({ id: employeeId, ...formData })
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
