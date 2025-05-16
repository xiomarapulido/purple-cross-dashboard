<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EmployeesTable from '@/components/employees/EmployeesTable.vue'
import type { Employee } from '@/types/Employee'
import rawEmployees from '@/data/employees.json'

const employees = ref<Employee[]>([])
const router = useRouter()

function loadEmployees() {
    const stored = localStorage.getItem('employees')
    if (stored) {
        employees.value = JSON.parse(stored)
    } else {
        employees.value = [...rawEmployees]
        localStorage.setItem('employees', JSON.stringify(employees.value))
    }
}

onMounted(() => {
    loadEmployees()
})

function handleEdit(employee: Employee) {
    //router.push({ name: 'EmployeeEdit', params: { id: employee.id } })
    localStorage.removeItem('employees')
}

function handleDelete(employee: Employee) {
    const confirmed = confirm(`¿Quieres eliminar a ${employee.fullName}?`)
    if (confirmed) {
        employees.value = employees.value.filter(e => e.id !== employee.id)
        localStorage.setItem('employees', JSON.stringify(employees.value))
    }
}

function goToCreate() {
    router.push({ name: 'EmployeeCreate' })
}

function refreshList() {
    loadEmployees()
}
</script>

<template>
    <div class="position-relative">
        <EmployeesTable :employees="employees" @edit-employee="handleEdit" @delete-employee="handleDelete" />
        <button class="btn btn-primary position-fixed" style="bottom: 20px; right: 20px;" @click="goToCreate">
            Create Employee
        </button>
    </div>
</template>
