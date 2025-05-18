<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Employee } from '@/types/Employee'
import { exportEmployeesToCSV } from '@/utils/exportCsv'
import {
  EVENTS,
  SORT_KEYS,
  TABLE_HEADERS,
  BUTTON_LABELS,
  PLACEHOLDERS,
  MESSAGES,
  CSV_HEADERS,
} from '@/constants/employeeTableConstants'

import {
  formatEmploymentDate,
  formatTerminationDate,
} from '@/utils/formatDates'

const props = defineProps<{ employees: Employee[] }>()
const emit = defineEmits<{
  (e: typeof EVENTS.EDIT_EMPLOYEE, employee: Employee): void
  (e: typeof EVENTS.DELETE_EMPLOYEE, employee: Employee): void
  (e: typeof EVENTS.VIEW_EMPLOYEE, employee: Employee): void
}>()

const searchQuery = ref('')
const rowsPerPage = ref(5)
const currentPage = ref(1)
const sortKey = ref<keyof Employee>(SORT_KEYS.FULL_NAME)
const sortAsc = ref(true)

const filteredEmployees = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return props.employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.occupation.toLowerCase().includes(query)
  )
})

const sortedEmployees = computed(() => {
  return [...filteredEmployees.value].sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]

    if (
      sortKey.value === SORT_KEYS.DATE_OF_EMPLOYMENT ||
      sortKey.value === SORT_KEYS.TERMINATION_DATE
    ) {
      valA = valA ? new Date(valA).getTime() : 0
      valB = valB ? new Date(valB).getTime() : 0
    } else {
      valA = valA?.toString().toLowerCase() ?? ''
      valB = valB?.toString().toLowerCase() ?? ''
    }

    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
})

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  return sortedEmployees.value.slice(start, start + rowsPerPage.value)
})

const totalPages = computed(() =>
  Math.ceil(sortedEmployees.value.length / rowsPerPage.value)
)

function changeSort(key: keyof typeof SORT_KEYS) {
  const employeeKey = SORT_KEYS[key]
  if (sortKey.value === employeeKey) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = employeeKey
    sortAsc.value = true
  }
}

function onView(employee: Employee) {
  emit(EVENTS.VIEW_EMPLOYEE, employee)
}

function onEdit(employee: Employee) {
  emit(EVENTS.EDIT_EMPLOYEE, employee)
}

function onDelete(employee: Employee) {
  emit(EVENTS.DELETE_EMPLOYEE, employee)
}

function exportToCSV() {
  exportEmployeesToCSV(sortedEmployees.value)
}

</script>

<template>
  <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
    <input
      v-model="searchQuery"
      type="text"
      class="form-control w-auto"
      :placeholder="PLACEHOLDERS.search"
    />
    <div class="d-flex align-items-center gap-2">
      <label for="rowsPerPage" class="form-label mb-0">{{ MESSAGES.rowsPerPage }}</label>
      <select id="rowsPerPage" v-model="rowsPerPage" class="form-select w-auto">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>
    <button @click="exportToCSV" class="btn btn-outline-success">
      {{ BUTTON_LABELS.exportCSV }}
    </button>
  </div>

  <div class="table-responsive">
    <table class="table table-hover table-bordered align-middle text-center">
      <thead class="table-light">
        <tr>
          <th @click="changeSort('FULL_NAME')" role="button">
            {{ TABLE_HEADERS.name }}
            <span
              :class="sortKey === SORT_KEYS.FULL_NAME
                ? sortAsc
                  ? 'bi bi-caret-up-fill'
                  : 'bi bi-caret-down-fill'
                : ''"
            />
          </th>
          <th @click="changeSort('DEPARTMENT')" role="button">
            {{ TABLE_HEADERS.department }}
            <span
              :class="sortKey === SORT_KEYS.DEPARTMENT
                ? sortAsc
                  ? 'bi bi-caret-up-fill'
                  : 'bi bi-caret-down-fill'
                : ''"
            />
          </th>
          <th @click="changeSort('OCCUPATION')" role="button">
            {{ TABLE_HEADERS.position }}
            <span
              :class="sortKey === SORT_KEYS.OCCUPATION
                ? sortAsc
                  ? 'bi bi-caret-up-fill'
                  : 'bi bi-caret-down-fill'
                : ''"
            />
          </th>
          <th @click="changeSort('DATE_OF_EMPLOYMENT')" role="button">
            {{ TABLE_HEADERS.hired }}
            <span
              :class="sortKey === SORT_KEYS.DATE_OF_EMPLOYMENT
                ? sortAsc
                  ? 'bi bi-caret-up-fill'
                  : 'bi bi-caret-down-fill'
                : ''"
            />
          </th>
          <th @click="changeSort('TERMINATION_DATE')" role="button">
            {{ TABLE_HEADERS.terminationDate }}
            <span
              :class="sortKey === SORT_KEYS.TERMINATION_DATE
                ? sortAsc
                  ? 'bi bi-caret-up-fill'
                  : 'bi bi-caret-down-fill'
                : ''"
            />
          </th>
          <th>{{ TABLE_HEADERS.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedEmployees.length === 0">
          <td colspan="6">{{ MESSAGES.noResults }}</td>
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
          {{ BUTTON_LABELS.previous }}
        </button>
      </li>
      <li
        class="page-item"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
      >
        <button class="page-link" @click="currentPage = page">{{ page }}</button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
          {{ BUTTON_LABELS.next }}
        </button>
      </li>
    </ul>
  </nav>
</template>
