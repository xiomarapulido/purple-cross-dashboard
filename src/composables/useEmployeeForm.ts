import { reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Employee } from '@/types/Employee'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { VALIDATION_MESSAGES} from '@/constants/employeeFormConstants'

export function useEmployeeForm() {
  const route = useRoute()

  const schema = yup.object({
    code: yup
      .string()
      .required(VALIDATION_MESSAGES.code)
      .matches(/^[a-zA-Z0-9\-_\s]+$/, VALIDATION_MESSAGES.codeInvalid)
      .test('unique-code', VALIDATION_MESSAGES.codeUnique, function(value) {
        if (!value) return true

        const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
        if (!employeesJson) return true

        const employees: Employee[] = JSON.parse(employeesJson)
        const currentId = route.params.id ? Number(route.params.id) : null

        return !employees.some(e => e.code === value && e.id !== currentId)
      }),
    fullName: yup
      .string()
      .required(VALIDATION_MESSAGES.fullName)
      .matches(/^[a-zA-Z\s]+$/, VALIDATION_MESSAGES.fullNameInvalid),
    occupation: yup
      .string()
      .required(VALIDATION_MESSAGES.occupation)
      .matches(/^[a-zA-Z\s]+$/, VALIDATION_MESSAGES.occupationInvalid),
    department: yup
      .string()
      .required(VALIDATION_MESSAGES.department)
      .matches(/^[a-zA-Z\s]+$/, VALIDATION_MESSAGES.departmentInvalid),
    dateOfEmployment: yup.date().nullable(),
    terminationDate: yup.date().nullable(),
  })

  const formData = reactive<Employee>({
    id: 0,
    code: '',
    fullName: '',
    occupation: '',
    department: '',
    dateOfEmployment: null,
    terminationDate: null,
  })

  const { handleSubmit, errors, resetForm } = useForm<Employee>({
    validationSchema: schema,
    initialValues: formData,
  })

  watch(
    formData,
    (newVal) => {
      resetForm({ values: newVal })
    },
    { immediate: true, deep: true }
  )

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

  function saveEmployee(employee: Employee) {
    const employeesJson = localStorage.getItem(STORAGE_KEYS.employees)
    const employees: Employee[] = employeesJson ? JSON.parse(employeesJson) : []

    const index = employees.findIndex((e) => e.id === employee.id)
    if (index >= 0) {
      employees[index] = employee
    } else {
      employees.unshift(employee)
    }
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees))
  }

  return {
    formData,
    errors,
    handleSubmit,
    saveEmployee,
  }
}
