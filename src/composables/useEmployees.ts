import { ref } from 'vue'
import type { Employee } from '@/types/Employee'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { simulateApiFetch } from '@/utils/apiSimulator'
import { texts } from '@/i18n'

const employees = ref<Employee[]>([])
const errorMessage = ref<string | null>(null)


async function loadEmployees() {
  const stored = localStorage.getItem(STORAGE_KEYS.employees)

  if (stored) {
    employees.value = JSON.parse(stored)
    errorMessage.value = null
  } else {
    try {
      const data = await simulateApiFetch<Employee[]>('/data/employees.json')
      employees.value = data
      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(data))
      errorMessage.value = null
    } catch (error) {
      employees.value = []
      errorMessage.value = texts.employeeForm.messages.error
    }
  }
}

// Save the current employees list to localStorage
function saveEmployees() {
  localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees.value))
}

// Remove employee by ID and update storage
function deleteEmployee(id: number) {
  employees.value = employees.value.filter(e => e.id !== id)
  saveEmployees()
}

// Composable exposing employees and related methods
export function useEmployees() {
  return {
    employees,
    loadEmployees,
    deleteEmployee,
    saveEmployees,
    errorMessage
  }
}
