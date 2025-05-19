<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { Employee } from '@/types/Employee'
import { useEmployeeTableLogic } from '@/composables/useEmployeeTableLogic'
import { SORT_KEYS } from '@/constants/employeeTableConstants'
import { formatEmploymentDate, formatTerminationDate } from '@/utils/formatDates'
import { exportEmployeesToCSV } from '@/utils/exportCsv'
import { useTexts } from '@/i18n/useTexts'

const { texts } = useTexts()

const props = defineProps<{ employees: Employee[] }>()
const emit = defineEmits<{
  (e: 'edit-employee', employee: Employee): void
  (e: 'delete-employee', employee: Employee): void
  (e: 'view-employee', employee: Employee): void
}>()

const searchQuery = ref('')
const rowsPerPage = ref(5)
const currentPage = ref(1)
const sortKey = ref<keyof Employee>(SORT_KEYS.FULL_NAME)
const sortAsc = ref(true)

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

function onView(employee: Employee) {
  emit('view-employee', employee)
}

function onEdit(employee: Employee) {
  emit('edit-employee', employee)
}

function onDelete(employee: Employee) {
  emit('delete-employee', employee)
}

function exportToCSV() {
  exportEmployeesToCSV(sortedEmployees.value)
}

</script>


<template>
  <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
    <input v-model="searchQuery" type="text" class="form-control w-auto"
      :placeholder="texts.employeeTable.placeholders.search" />
    <div class="d-flex align-items-center gap-2">
      <label for="rowsPerPage" class="form-label mb-0">{{ texts.employeeTable.messages.rowsPerPage }}</label>
      <select id="rowsPerPage" v-model="rowsPerPage" class="form-select w-auto">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>
    <button @click="exportToCSV" class="btn btn-outline-success">
      {{ texts.employeeTable.buttonLabels.exportCSV }}
    </button>
  </div>

  <div class="table-responsive">
    <table class="table table-hover table-bordered align-middle text-center">
      <thead class="table-light">
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
