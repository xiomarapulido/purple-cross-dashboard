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

  // Define validation schema using Yup with localized messages
  // Validates fields like code, fullName, occupation, department, and dates
  // Custom test ensures code is unique excluding current employee when editing
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

        // Check uniqueness of code among all employees except current one
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
    dateOfEmployment: yup.date().nullable(),  // Dates can be null
    terminationDate: yup.date().nullable(),
  })

  // Reactive form data object with initial empty/default values
  const formData = reactive<Employee>({
    id: 0,
    code: '',
    fullName: '',
    occupation: '',
    department: '',
    dateOfEmployment: null,
    terminationDate: null
  })

  // Initialize vee-validate form with schema and reactive data
  const { handleSubmit, errors, resetForm } = useForm<Employee>({
    validationSchema: schema,
    initialValues: formData,
  })

  // Watch formData changes and reset vee-validate form accordingly
  watch(
    formData,
    (newVal) => {
      resetForm({ values: newVal })
    },
    { immediate: true, deep: true }
  )

  // On component mount: if editing (route param id exists), load employee data into form
  onMounted(() => {
    const idParam = route.params.id
    if (idParam) {
      const id = Number(idParam)
      const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
      if (!employeesJson) return
      const employees: Employee[] = JSON.parse(employeesJson)
      const employeeToEdit = employees.find((e) => e.id === id)
      if (employeeToEdit) {
        Object.assign(formData, employeeToEdit) // Populate form data
      }
    }
  })

  /**
   * Saves employee data by simulating API update,
   * then updates localStorage employees list accordingly.
   * Inserts new or updates existing employee.
   *
   * @param employee - Employee data to save
   * @returns success status
   */
  async function saveEmployee(employee: Employee): Promise<{ success: boolean }> {
    try {
      await simulateApiUpdate(employee)
      const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
      const employees: Employee[] = employeesJson ? JSON.parse(employeesJson) : []

      const index = employees.findIndex((e) => e.id === employee.id)
      if (index >= 0) {
        employees[index] = employee // Update existing
      } else {
        employees.unshift(employee) // Add new employee at beginning
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
