import { ref } from 'vue'
import type { Employee } from '@/types/Employee'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { simulateApiFetch, simulateApiDelete } from '@/utils/apiSimulator'
import { texts } from '@/i18n'

const employees = ref<Employee[]>([]) // Reactive list of employees
const errorMessage = ref<string | null>(null) // Holds error messages, if any

/**
 * Loads employees from localStorage if available,
 * otherwise fetches from simulated API and caches the result.
 * Sets error message if loading fails.
 */
async function loadEmployees() {
  const stored = localStorage.getItem(STORAGE_KEYS.employees)

  if (stored) {
    // Load employees from localStorage cache
    employees.value = JSON.parse(stored)
    errorMessage.value = null
  } else {
    try {
      // Fetch employees from API simulation
      const data = await simulateApiFetch<Employee[]>('/data/employees.json')
      employees.value = data
      // Cache employees in localStorage
      localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(data))
      errorMessage.value = null
    } catch (error) {
      // Handle loading error
      employees.value = []
      errorMessage.value = texts.employeeForm.messages.error
    }
  }
}

/**
 * Saves the current list of employees to localStorage.
 */
function saveEmployees() {
  localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees.value))
}

/**
 * Deletes an employee by ID via simulated API call,
 * then updates local employees list and storage.
 * Returns a success flag and optional message.
 * 
 * @param id - Employee ID to delete
 * @returns Result object indicating success or failure
 */
async function deleteEmployee(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    await simulateApiDelete(id)
    // Filter out deleted employee from the list
    employees.value = employees.value.filter(e => e.id !== id)
    saveEmployees()

    return { success: true }
  } catch (error) {
    return {
      success: false,
    }
  }
}

/**
 * Composable that exposes employees state and related functions
 * for loading, deleting, saving employees and error message handling.
 */
export function useEmployees() {
  return {
    employees,
    loadEmployees,
    deleteEmployee,
    saveEmployees,
    errorMessage
  }
}
