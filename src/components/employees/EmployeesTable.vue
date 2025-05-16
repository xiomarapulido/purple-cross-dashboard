<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import employeesJson from '@/data/employees.json'

type Employee = {
    fullName: string
    occupation: string
    department: string
    dateOfEmployment: string
    terminationDate: string | null
}

const searchTerm = ref('')
const employees = ref<Employee[]>([])
const currentPage = ref(1)
const itemsPerPage = 5
const sortKey = ref<keyof Employee | ''>('')
const sortAsc = ref(true)

// Inicializar con el JSON
const loadEmployees = () => {
    const local = localStorage.getItem('employees')
    employees.value = local ? JSON.parse(local) : employeesJson
}

const saveEmployees = () => {
    localStorage.setItem('employees', JSON.stringify(employees.value))
}

const filteredEmployees = computed(() => {
    return employees.value.filter((e) =>
        Object.values(e).some((val) =>
            String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    )
})

const sortedEmployees = computed(() => {
    if (!sortKey.value) return filteredEmployees.value
    return [...filteredEmployees.value].sort((a, b) => {
        const aVal = a[sortKey.value]
        const bVal = b[sortKey.value]
        return sortAsc.value
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal))
    })
})

const totalPages = computed(() => Math.ceil(sortedEmployees.value.length / itemsPerPage))

const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return sortedEmployees.value.slice(start, start + itemsPerPage)
})

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const sortBy = (key: keyof Employee) => {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}

const confirmDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees.value.splice(index, 1)
        saveEmployees()
    }
}

loadEmployees()
</script>

<template>
    <div class="container my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Employees</h2>
            <input v-model="searchTerm" type="text" class="form-control w-50" placeholder="Search..." />
        </div>

        <table class="table table-hover table-striped table-bordered table-responsive">
            <thead class="table-light">
                <tr>
                    <th @click="sortBy('fullName')">Name</th>
                    <th @click="sortBy('occupation')">Occupation</th>
                    <th @click="sortBy('department')">Department</th>
                    <th @click="sortBy('dateOfEmployment')">Employment Date</th>
                    <th @click="sortBy('terminationDate')">Termination Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(employee, index) in paginatedEmployees" :key="index">
                    <td>{{ employee.fullName }}</td>
                    <td>{{ employee.occupation }}</td>
                    <td>{{ employee.department }}</td>
                    <td>{{ employee.dateOfEmployment }}</td>
                    <td>{{ employee.terminationDate || '—' }}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" @click="confirmDelete(index)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <nav>
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped lang="scss">
.table th {
    cursor: pointer;
}
</style>
