<script setup lang="ts">
// Vue reactivity and router hooks
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Custom composables for form handling and global alerts
import { useEmployeeForm } from '@/composables/useEmployeeForm'
import { useGlobalAlert } from '@/composables/useGlobalAlert'

// Constants for routes, events, statuses, and localized texts
import { ROUTES } from '@/constants/routes'
import { EVENTS } from '@/constants/events'
import { STATUS } from '@/constants/status'
import { texts } from '@/i18n'

const router = useRouter()
const route = useRoute()

// Form data, validation errors, submit handler, and save function from composable
const { formData, errors, handleSubmit, saveEmployee } = useEmployeeForm()

// Alert helper from composable
const { showAlert } = useGlobalAlert()

// Dynamic page title and submit button label based on create/edit mode
const pageTitle = computed(() => (route.params.id ? texts.employeeForm.actions.edit : texts.employeeForm.actions.create))
const submitLabel = computed(() => (route.params.id ? texts.employeeForm.actions.save : texts.employeeForm.actions.createTetx))

// Success message changes based on mode
const alertSuccessMsg = computed(() => (route.params.id ? texts.employeeForm.messages.editSuccess : texts.employeeForm.messages.createSuccess))

// Submit handler: saves employee and navigates back to list on success, shows alert otherwise
const onSubmit = handleSubmit(async () => {
  const employeeId = route.params.id ? Number(route.params.id) : Math.floor(Math.random() * 1000000)
  const result = await saveEmployee({ id: employeeId, ...formData })

  if (result.success) {
    showAlert(alertSuccessMsg.value, STATUS.success, true)
    window.dispatchEvent(new Event(EVENTS.employeesUpdated)) // Notify other parts of app
    router.push({ name: ROUTES.list }) // Navigate to employee list
  } else {
    showAlert(texts.employeeForm.messages.error, STATUS.error, true)
  }
})

// Cancel button navigates back to employee list
function onCancel() {
  router.push({ name: ROUTES.list })
}
</script>

<template>
  <div class="container py-4">
    <h3 class="page-title">{{ pageTitle }}</h3>
    <form @submit.prevent="onSubmit" novalidate>
      <!-- Employee Code input with validation error display -->
      <div class="mb-3">
        <label for="code">{{ texts.employeeForm.fieldLabels.code }}*</label>
        <input id="code" v-model="formData.code" type="text"
          :class="['form-control', errors.code ? 'is-invalid' : '']" />
        <div class="invalid-feedback">{{ errors.code }}</div>
      </div>

      <!-- Full Name input -->
      <div class="mb-3">
        <label for="fullName">{{ texts.employeeForm.fieldLabels.fullName }}*</label>
        <input id="fullName" v-model="formData.fullName" type="text"
          :class="['form-control', errors.fullName ? 'is-invalid' : '']" />
        <div class="invalid-feedback">{{ errors.fullName }}</div>
      </div>

      <!-- Occupation input -->
      <div class="mb-3">
        <label for="occupation">{{ texts.employeeForm.fieldLabels.occupation }}*</label>
        <input id="occupation" v-model="formData.occupation" type="text"
          :class="['form-control', errors.occupation ? 'is-invalid' : '']" />
        <div class="invalid-feedback">{{ errors.occupation }}</div>
      </div>

      <!-- Department input -->
      <div class="mb-3">
        <label for="department">{{ texts.employeeForm.fieldLabels.department }}*</label>
        <input id="department" v-model="formData.department" type="text"
          :class="['form-control', errors.department ? 'is-invalid' : '']" />
        <div class="invalid-feedback">{{ errors.department }}</div>
      </div>

      <!-- Employment Dates -->
      <div class="mb-3">
        <label for="dateOfEmployment">{{ texts.employeeForm.fieldLabels.dateOfEmployment }}</label>
        <input id="dateOfEmployment" v-model="formData.dateOfEmployment" type="date" class="form-control" />
      </div>

      <div class="mb-3">
        <label for="terminationDate">{{ texts.employeeForm.fieldLabels.terminationDate }}</label>
        <input id="terminationDate" v-model="formData.terminationDate" type="date" class="form-control" />
      </div>

      <!-- Action buttons -->
      <div class="d-flex gap-2 justify-content-end">
        <button type="button" class="btn btn-secondary" @click="onCancel">{{ texts.employeeForm.buttonLabels.cancel
          }}</button>
        <button type="submit" class="btn btn-primary">{{ submitLabel }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page-title {
  color: var(--purple);
  font-size: 1.625rem;
  margin-bottom: 1.875rem;
}

label {
  font-weight: bold;
}
</style>
