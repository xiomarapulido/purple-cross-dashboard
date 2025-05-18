<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import EmployeesTable from '@/components/employees/EmployeesTable.vue'
import EmployeeModal from '@/components/employees/EmployeeModal.vue'
import type { Employee } from '@/types/Employee'
import { useEmployees } from '@/composables/useEmployees'  
import { emitter } from '@/eventBus'  
import { ROUTES } from '@/constants/routes'  
import { EVENTS } from '@/constants/events'

const router = useRouter()
const { employees, loadEmployees, deleteEmployee } = useEmployees()

const selectedEmployee = ref<Employee | null>(null)  // currently selected employee for modal
const showModal = ref(false)  // controls visibility of employee modal

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

// Confirm deletion and trigger employee removal
function handleDelete(employee: Employee) {
  const confirmed = confirm(`Do you want to delete ${employee.fullName}?`)
  if (confirmed) {
    deleteEmployee(employee.id)
  }
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

// Close modal and clear selected employee
function closeModal() {
  showModal.value = false
  selectedEmployee.value = null
}
</script>

<template>
  <div class="main-container position-relative">
    <h1 class="page-title">Employee Management</h1>
    <!-- Employees table with edit, delete, and view events -->
    <EmployeesTable
      :employees="employees"
      @edit-employee="handleEdit"
      @delete-employee="handleDelete"
      @view-employee="handleView"
    />
    <!-- Fixed button to create new employee -->
    <button
      class="btn btn-primary btn-create-fixed"
      @click="goToCreate"
      aria-label="Create new employee"
    >
      Create Employee
    </button>
    <!-- Employee details modal -->
    <EmployeeModal
      v-if="showModal"
      :employee="selectedEmployee"
      :show="showModal"
      @close="closeModal"
    />
  </div>
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
