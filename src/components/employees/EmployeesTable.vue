<script setup lang="ts">
// Imports and types
import { ref, toRef } from 'vue'
import type { Employee } from '@/types/Employee'
import { useEmployeeTableLogic } from '@/composables/useEmployeeTableLogic'
import { SORT_KEYS } from '@/constants/employeeTableConstants'
import { formatEmploymentDate, formatTerminationDate } from '@/utils/formatDates'
import { exportEmployeesToCSV } from '@/utils/exportCsv'
import { useTexts } from '@/i18n/useTexts'
import { importEmployeesFromCSV } from '@/utils/importCSV'

// Localization texts
const { texts } = useTexts()

// Props: employees list
const props = defineProps<{ employees: Employee[] }>()

// Emits: user actions to parent component
const emit = defineEmits<{
  (e: 'edit-employee', employee: Employee): void
  (e: 'delete-employee', employee: Employee): void
  (e: 'view-employee', employee: Employee): void
  (e: 'import-employees', employees: Employee[]): void
  (e: 'import-employees-error', errors: string[]): void
}>()

// Reactive state for search, pagination, sorting
const searchQuery = ref('')
const rowsPerPage = ref(5)
const currentPage = ref(1)
const sortKey = ref<keyof Employee>(SORT_KEYS.FULL_NAME)
const sortAsc = ref(true)

// Composable handling filtering, sorting, pagination
const {
  paginatedEmployees,
  totalPages,
  sortedEmployees,
  changeSort
} = useEmployeeTableLogic(
  toRef(props, 'employees'),
  searchQuery,
  rowsPerPage,
  currentPage,
  sortKey,
  sortAsc
)

// Emit events for viewing, editing, deleting employees
function onView(employee: Employee) {
  emit('view-employee', employee)
}
function onEdit(employee: Employee) {
  emit('edit-employee', employee)
}
function onDelete(employee: Employee) {
  emit('delete-employee', employee)
}

// Export current sorted list to CSV
function exportToCSV() {
  exportEmployeesToCSV(sortedEmployees.value)
}

// File input ref and handlers for CSV import
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Import employees and handle errors or valid entries
  const { validEmployees, errors } = await importEmployeesFromCSV(file, props.employees)

  if (errors.length) {
    emit('import-employees-error', errors)
  }
  if (validEmployees.length) {
    emit('import-employees', validEmployees)
  }

  // Reset file input value
  target.value = ''
}
</script>

<template>
  <!-- Controls: search, rows per page, export/import CSV -->
  <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
    <div class="col-12">
      <div class="row">
        <div class="mb-3 col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <input v-model="searchQuery" type="text" class="form-control w-auto"
            :placeholder="texts.employeeTable.placeholders.search" />
        </div>
        <div class="mb-3 col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 text-end">
          <div class="d-flex align-items-center justify-content-end gap-2">
            <label for="rowsPerPage" class="form-label mb-0 small">
              {{ texts.employeeTable.messages.rowsPerPage }}
            </label>
            <select id="rowsPerPage" v-model="rowsPerPage" class="form-select form-select-sm"
              style="width: auto; min-width: 80px;">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
            </select>
          </div>
        </div>
        <div class="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 text-start text-md-end">
          <button @click="exportToCSV" class="btn btn-outline-success">
            {{ texts.employeeTable.buttonLabels.exportCSV }}
          </button>
        </div>
        <div class="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 text-end">
          <input type="file" class="d-none" ref="fileInput" accept=".csv" @change="onFileChange" />
          <button @click="triggerFileInput" class="btn btn-outline-primary">
            {{ texts.employeeTable.buttonLabels.importCSV }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Employee Table -->
  <div class="table-responsive">
    <table class="table table-hover table-bordered align-middle text-center">
      <thead class="table-primary">
        <tr>
          <th @click="changeSort('FULL_NAME')" role="button">
            {{ texts.employeeTable.tableHeaders.name }}
            <span :class="sortKey === SORT_KEYS.FULL_NAME
              ? sortAsc
                ? 'bi bi-caret-up-fill'
                : 'bi bi-caret-down-fill'
              : ''" />
          </th>
          <th @click="changeSort('DEPARTMENT')" role="button">
            {{ texts.employeeTable.tableHeaders.department }}
            <span :class="sortKey === SORT_KEYS.DEPARTMENT
              ? sortAsc
                ? 'bi bi-caret-up-fill'
                : 'bi bi-caret-down-fill'
              : ''" />
          </th>
          <th @click="changeSort('OCCUPATION')" role="button">
            {{ texts.employeeTable.tableHeaders.position }}
            <span :class="sortKey === SORT_KEYS.OCCUPATION
              ? sortAsc
                ? 'bi bi-caret-up-fill'
                : 'bi bi-caret-down-fill'
              : ''" />
          </th>
          <th @click="changeSort('DATE_OF_EMPLOYMENT')" role="button">
            {{ texts.employeeTable.tableHeaders.hired }}
            <span :class="sortKey === SORT_KEYS.DATE_OF_EMPLOYMENT
              ? sortAsc
                ? 'bi bi-caret-up-fill'
                : 'bi bi-caret-down-fill'
              : ''" />
          </th>
          <th @click="changeSort('TERMINATION_DATE')" role="button">
            {{ texts.employeeTable.tableHeaders.terminationDate }}
            <span :class="sortKey === SORT_KEYS.TERMINATION_DATE
              ? sortAsc
                ? 'bi bi-caret-up-fill'
                : 'bi bi-caret-down-fill'
              : ''" />
          </th>
          <th>{{ texts.employeeTable.tableHeaders.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedEmployees.length === 0">
          <td colspan="6">{{ texts.employeeTable.messages.noResults }}</td>
        </tr>
        <tr v-for="employee in paginatedEmployees" :key="employee.id">
          <td>{{ employee.fullName }}</td>
          <td>{{ employee.department }}</td>
          <td>{{ employee.occupation }}</td>
          <td>{{ formatEmploymentDate(employee.dateOfEmployment) }}</td>
          <td>{{ formatTerminationDate(employee.terminationDate) }}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" @click="onView(employee)">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-warning me-1" @click="onEdit(employee)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="onDelete(employee)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <nav class="d-flex justify-content-center mt-3">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
          {{ texts.employeeTable.buttonLabels.previous }}
        </button>
      </li>
      <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
        <button class="page-link" @click="currentPage = page">{{ page }}</button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
          {{ texts.employeeTable.buttonLabels.next }}
        </button>
      </li>
    </ul>
  </nav>
</template>
