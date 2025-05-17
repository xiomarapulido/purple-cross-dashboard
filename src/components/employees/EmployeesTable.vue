<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Employee } from '@/types/Employee'

const props = defineProps<{ employees: Employee[] }>()
const emit = defineEmits<{
    (e: 'edit-employee', employee: Employee): void
    (e: 'delete-employee', employee: Employee): void
    (e: 'view-employee', employee: Employee): void
}>()

const searchQuery = ref('')
const rowsPerPage = ref(5)
const currentPage = ref(1)
const sortKey = ref<'fullName' | 'department' | 'occupation' | 'dateOfEmployment' | 'terminationDate'>('fullName')
const sortAsc = ref(true)

const filteredEmployees = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return props.employees.filter(emp =>
        emp.fullName.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.occupation.toLowerCase().includes(query)
    )
})

const sortedEmployees = computed(() => {
    return [...filteredEmployees.value].sort((a, b) => {
        let valA = a[sortKey.value]
        let valB = b[sortKey.value]

        if (sortKey.value === 'dateOfEmployment' || sortKey.value === 'terminationDate') {
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

const totalPages = computed(() => Math.ceil(sortedEmployees.value.length / rowsPerPage.value))

function changeSort(key: typeof sortKey.value) {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}

function formatEmploymentDate(dateStr: string | undefined) {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date > today) return 'Employed soon'
    else return 'Currently employed'
}

function formatTerminationDate(dateStr: string | undefined) {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date > today) return 'To be terminated'
    else return 'Terminated'
}

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
    const headers = ['Name', 'Department', 'Position', 'Hired', 'Termination Date']
    const rows = sortedEmployees.value.map(emp => [
        `"${emp.fullName}"`,
        `"${emp.department}"`,
        `"${emp.occupation}"`,
        `"${formatEmploymentDate(emp.dateOfEmployment)}"`,
        `"${formatTerminationDate(emp.terminationDate)}"`
    ])

    let csvContent = headers.join(',') + '\n'
    csvContent += rows.map(e => e.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'employees.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
</script>

<template>
    <div class="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <input v-model="searchQuery" type="text" class="form-control w-auto" placeholder="Search..." />
        <div class="d-flex align-items-center gap-2">
            <label for="rowsPerPage" class="form-label mb-0">Rows per page:</label>
            <select id="rowsPerPage" v-model="rowsPerPage" class="form-select w-auto">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
            </select>
        </div>
        <button @click="exportToCSV" class="btn btn-outline-success">Export to CSV</button>
    </div>

    <div class="table-responsive">
        <table class="table table-hover table-bordered align-middle text-center">
            <thead class="table-light">
                <tr>
                    <th @click="changeSort('fullName')" role="button">
                        Name
                        <span
                            :class="sortKey === 'fullName' ? (sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''" />
                    </th>
                    <th @click="changeSort('department')" role="button">
                        Department
                        <span
                            :class="sortKey === 'department' ? (sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''" />
                    </th>
                    <th @click="changeSort('occupation')" role="button">
                        Position
                        <span
                            :class="sortKey === 'occupation' ? (sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''" />
                    </th>
                    <th @click="changeSort('dateOfEmployment')" role="button">
                        Hired
                        <span
                            :class="sortKey === 'dateOfEmployment' ? (sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''" />
                    </th>
                    <th @click="changeSort('terminationDate')" role="button">
                        Termination Date
                        <span
                            :class="sortKey === 'terminationDate' ? (sortAsc ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill') : ''" />
                    </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="paginatedEmployees.length === 0">
                    <td colspan="6">No matching employees found.</td>
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
                <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">Previous</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
            </li>
        </ul>
    </nav>
</template>
