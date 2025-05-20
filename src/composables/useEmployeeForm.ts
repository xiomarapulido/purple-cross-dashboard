import { reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Employee } from '@/types/Employee'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { texts } from '@/i18n'
import { simulateApiUpdate } from '@/utils/apiSimulator'

export function useEmployeeForm() {
  const route = useRoute()

  // Define validation schema using Yup with messages from constants
  const schema = yup.object({
    code: yup
      .string()
      .required(texts.employeeForm.validationMessages.code)
      .matches(/^[a-zA-Z0-9\-_\s]+$/, texts.employeeForm.validationMessages.codeInvalid)
      .test('unique-code', texts.employeeForm.validationMessages.codeUnique, function (value) {
        if (!value) return true

        const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
        if (!employeesJson) return true

        const employees: Employee[] = JSON.parse(employeesJson)
        const currentId = route.params.id ? Number(route.params.id) : null

        // Check that the code is unique among other employees (excluding current one)
        return !employees.some(e => e.code === value && e.id !== currentId)
      }),
    fullName: yup
      .string()
      .required(texts.employeeForm.validationMessages.fullName)
      .matches(/^[a-zA-Z\s]+$/, texts.employeeForm.validationMessages.fullNameInvalid),
    occupation: yup
      .string()
      .required(texts.employeeForm.validationMessages.occupation)
      .matches(/^[a-zA-Z\s]+$/, texts.employeeForm.validationMessages.occupationInvalid),
    department: yup
      .string()
      .required(texts.employeeForm.validationMessages.department)
      .matches(/^[a-zA-Z\s]+$/, texts.employeeForm.validationMessages.departmentInvalid),
    dateOfEmployment: yup.date().nullable(),
    terminationDate: yup.date().nullable(),
  })

  // Reactive form data model
  const formData = reactive<Employee>({
    id: 0,
    code: '',
    fullName: '',
    occupation: '',
    department: '',
    dateOfEmployment: null,
    terminationDate: null
  })

  // Initialize form with validation schema and initial values
  const { handleSubmit, errors, resetForm } = useForm<Employee>({
    validationSchema: schema,
    initialValues: formData,
  })

  // Watch form data and reset the form whenever it changes
  watch(
    formData,
    (newVal) => {
      resetForm({ values: newVal })
    },
    { immediate: true, deep: true }
  )

  // On mount, load employee data if editing an existing one
  onMounted(() => {
    const idParam = route.params.id
    if (idParam) {
      const id = Number(idParam)
      const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
      if (!employeesJson) return
      const employees: Employee[] = JSON.parse(employeesJson)
      const employeeToEdit = employees.find((e) => e.id === id)
      if (employeeToEdit) {
        Object.assign(formData, employeeToEdit)
      }
    }
  })

  async function saveEmployee(employee: Employee): Promise<{ success: boolean }> {
    try {
      await simulateApiUpdate(employee)
      const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
      const employees: Employee[] = employeesJson ? JSON.parse(employeesJson) : []

      const index = employees.findIndex((e) => e.id === employee.id)
      if (index >= 0) {
        employees[index] = employee
      } else {
        employees.unshift(employee)
      }

      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees))

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false
      }
    }
  }

  return {
    formData,
    errors,
    handleSubmit,
    saveEmployee,
  }
}
