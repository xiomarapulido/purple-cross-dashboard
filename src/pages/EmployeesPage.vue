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

// Para recibir actualizaciones del array modificado en EmployeesTable
function updateEmployees(newEmployees: Employee[]) {
    employees.value = newEmployees
}
</script>

<template>
    <div class="position-relative">
        <EmployeesTable :employees="employees" @update:employees="updateEmployees" />

        <button class="btn btn-primary position-fixed" style="bottom: 20px; right: 20px;" @click="openCreateForm">
            Create Employee
        </button>

        <CreateEmployeeForm v-if="showCreateForm" @submit="addEmployee" @cancel="closeCreateForm" />
    </div>
</template>
