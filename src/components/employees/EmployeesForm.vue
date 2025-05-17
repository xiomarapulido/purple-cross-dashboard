<script setup lang="ts">
import { reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Employee } from '@/types/Employee'

const router = useRouter()
const route = useRoute()

const schema = yup.object({
    code: yup.string().required('Code is required'),
    fullName: yup.string().required('Full name is required'),
    occupation: yup.string().required('Occupation is required'),
    department: yup.string().required('Department is required'),
    dateOfEmployment: yup.date().nullable(),
    terminationDate: yup.date().nullable()
})

const formData = reactive<Employee>({
    id: 0,
    code: '',
    fullName: '',
    occupation: '',
    department: '',
    dateOfEmployment: null,
    terminationDate: null
})

const { handleSubmit, errors, resetForm } = useForm<Employee>({
    validationSchema: schema,
    initialValues: formData
})

watch(formData, (newVal) => {
    resetForm({ values: newVal })
}, { immediate: true, deep: true })

onMounted(() => {
    const idParam = route.params.id
    if (idParam) {
        const id = Number(idParam)
        const employeesJson = localStorage.getItem('employees')
        if (!employeesJson) return
        const employees: Employee[] = JSON.parse(employeesJson)
        const employeeToEdit = employees.find(e => e.id === id)
        if (employeeToEdit) {
            Object.assign(formData, employeeToEdit)
        }
    }
})

const pageTitle = computed(() => {
    return route.params.id ? 'Edit Employee' : 'Create Employee'
})

const onSubmit = handleSubmit(() => {
    const employeesJson = localStorage.getItem('employees')
    const employees: Employee[] = employeesJson ? JSON.parse(employeesJson) : []
    
    const employeeId = route.params.id ? Number(route.params.id) : Math.floor(Math.random() * 1000000)
    const newEmployee: Employee = { id: employeeId, ...formData }

    const index = employees.findIndex(e => e.id === employeeId)
    if (index >= 0) {
        // Actualizar empleado existente
        employees[index] = newEmployee
    } else {
        // Insertar nuevo empleado al inicio
        employees.unshift(newEmployee)
    }
    localStorage.setItem('employees', JSON.stringify(employees))

    // Disparar evento para avisar al padre que recargue la lista
    window.dispatchEvent(new Event('employees-updated'))

    router.push({ name: 'Employees' })
})

function onCancel() {
    router.push({ name: 'Employees' })
}
</script>

<template>
    <div class="container py-4">
        <h3>{{ pageTitle }}</h3>
        <form @submit.prevent="onSubmit" novalidate>
            <div class="mb-3">
                <label for="code">Code *</label>
                <input id="code" v-model="formData.code" type="text"
                    :class="['form-control', errors.code ? 'is-invalid' : '']" />
                <div class="invalid-feedback">{{ errors.code }}</div>
            </div>
            <div class="mb-3">
                <label for="fullName">Full Name *</label>
                <input id="fullName" v-model="formData.fullName" type="text"
                    :class="['form-control', errors.fullName ? 'is-invalid' : '']" />
                <div class="invalid-feedback">{{ errors.fullName }}</div>
            </div>
            <div class="mb-3">
                <label for="occupation">Occupation *</label>
                <input id="occupation" v-model="formData.occupation" type="text"
                    :class="['form-control', errors.occupation ? 'is-invalid' : '']" />
                <div class="invalid-feedback">{{ errors.occupation }}</div>
            </div>
            <div class="mb-3">
                <label for="department">Department *</label>
                <input id="department" v-model="formData.department" type="text"
                    :class="['form-control', errors.department ? 'is-invalid' : '']" />
                <div class="invalid-feedback">{{ errors.department }}</div>
            </div>
            <div class="mb-3">
                <label for="dateOfEmployment">Date of Employment</label>
                <input id="dateOfEmployment" v-model="formData.dateOfEmployment" type="date" class="form-control" />
            </div>
            <div class="mb-3">
                <label for="terminationDate">Termination Date</label>
                <input id="terminationDate" v-model="formData.terminationDate" type="date" class="form-control" />
            </div>
            <div class="d-flex gap-2 justify-content-end">
                <button type="button" class="btn btn-secondary" @click="onCancel">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ route.params.id ? 'Save' : 'Create' }}</button>
            </div>
        </form>
    </div>
</template>
