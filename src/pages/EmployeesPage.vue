<script setup lang="ts">
import { ref } from 'vue'
import EmployeesTable from '@/components/employees/EmployeesTable.vue'
import CreateEmployeeForm from '@/components/employees/CreateEmployeeForm.vue'
import rawEmployees from '@/data/employees.json'
import type { Employee } from '@/types/Employee'

const employees = ref<Employee[]>([...rawEmployees])
const showCreateForm = ref(false)

function addEmployee(newEmployee: Employee) {
    employees.value.push(newEmployee)
    showCreateForm.value = false
}

function openCreateForm() {
    showCreateForm.value = true
}

function closeCreateForm() {
    showCreateForm.value = false
}

function handleEdit(employee: Employee) {
    alert(`Editar empleado: ${employee.fullName}`)
}

function handleDelete(employee: Employee) {
    const confirmed = confirm(`¿Quieres eliminar a ${employee.fullName}?`)
    if (confirmed) {
        employees.value = employees.value.filter(e => e.id !== employee.id)
    }
}
</script>

<template>
    <div class="position-relative">
        <EmployeesTable :employees="employees" @edit-employee="handleEdit" @delete-employee="handleDelete" />

        <button class="btn btn-primary position-fixed" style="bottom: 20px; right: 20px;" @click="openCreateForm">
            Create Employee
        </button>

        <CreateEmployeeForm v-if="showCreateForm" @submit="addEmployee" @cancel="closeCreateForm" />
    </div>
</template>
