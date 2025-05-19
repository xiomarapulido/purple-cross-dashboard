<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import EmployeesTable from '@/components/employees/EmployeesTable.vue'
import EmployeeModal from '@/components/employees/EmployeeModal.vue'
import ConfirmDeleteModal from '@/components/employees/ConfirmDeleteModal.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import type { Employee } from '@/types/Employee'
import { useEmployees } from '@/composables/useEmployees'
import { emitter } from '@/eventBus'
import { ROUTES } from '@/constants/routes'
import { EVENTS } from '@/constants/events'
import { STATUS } from '@/constants/alertStatus'
import { texts } from '@/i18n'


const showDeleteModal = ref(false)
const employeeToDelete = ref<Employee | null>(null)


const router = useRouter()
const { employees, loadEmployees, deleteEmployee, saveEmployees } = useEmployees()

const selectedEmployee = ref<Employee | null>(null)  // currently selected employee for modal
const showModal = ref(false)  // controls visibility of employee modal

const alertVisible = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')

// Load employees on component mount and listen for update events
onMounted(() => {
  loadEmployees()
  emitter.on(EVENTS.employeesUpdated, loadEmployees)  // refresh list on event
})

// Clean up event listener on component unmount
onUnmounted(() => {
  emitter.off(EVENTS.employeesUpdated, loadEmployees)
})

// Navigate to edit page with employee id as param
function handleEdit(employee: Employee) {
  router.push({ name: ROUTES.edit, params: { id: employee.id } })
}

function handleDelete(employee: Employee) {
  employeeToDelete.value = employee
  showDeleteModal.value = true
}

function confirmDelete() {
  if (employeeToDelete.value) {
    deleteEmployee(employeeToDelete.value.id)
    showDeleteModal.value = false
    employeeToDelete.value = null
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  employeeToDelete.value = null
}

// Navigate to employee creation page
function goToCreate() {
  router.push({ name: ROUTES.create })
}

// Show employee details in modal
function handleView(employee: Employee) {
  selectedEmployee.value = employee
  showModal.value = true
}

function onImportEmployees(newEmployees: Employee[]) {
  if (newEmployees.length > 0) {
    alertMessage.value = texts.utils.importCSV.success
    alertType.value = 'success'
    alertVisible.value = true
  }

  employees.value.push(...newEmployees)
  saveEmployees()
  emitter.emit(EVENTS.employeesUpdated)

}

function onImportEmployeesError(errors: string[]) {
  if (errors.length > 0) {
    alertMessage.value = errors.join('\n')
    alertType.value = 'error'
    alertVisible.value = true
  }

}

// Close modal and clear selected employee
function closeModal() {
  showModal.value = false
  selectedEmployee.value = null
}
</script>

<template>
  <AlertMessage v-model:modelValue="alertVisible" :message="alertMessage" :type="alertType" :duration="3000" />
  <div class="main-container position-relative">
    <h1 class="page-title">{{ texts.employeesPage.title }}</h1>
    <!-- Employees table with edit, delete, and view events -->
    <EmployeesTable :employees="employees" @edit-employee="handleEdit" @delete-employee="handleDelete"
      @view-employee="handleView" @import-employees="onImportEmployees"
      @import-employees-error="onImportEmployeesError" />

    <!-- Fixed button to create new employee -->
    <button class="btn btn-primary btn-create-fixed" @click="goToCreate">
      {{ texts.employeesPage.btnCreateEmployee }}
    </button>

    <!-- Employee details modal -->
    <EmployeeModal v-if="showModal" :employee="selectedEmployee" :show="showModal" @close="closeModal" />


  </div>

  <ConfirmDeleteModal v-if="showDeleteModal" :title="texts.employeesPage.modalDeleteTitle"
    :message="`${texts.employeesPage.modalDeleteMessage} ${employeeToDelete?.fullName}?`"
    :confirm-text="texts.employeesPage.modalDeleteConfirm" :cancel-text="texts.employeesPage.modalDeleteCancel"
    @confirm="confirmDelete" @cancel="cancelDelete" />
</template>

<style scoped>
.main-container {
  padding-bottom: 5rem;
}

.page-title {
  color: var(--purple);
  font-size: 1.625rem;
  margin-bottom: 1.875rem;
}

.btn-create-fixed {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 1050;
}

@media (max-width: 36em) {
  .btn-create-fixed {
    bottom: 4.375rem;
    right: 0.9375rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
