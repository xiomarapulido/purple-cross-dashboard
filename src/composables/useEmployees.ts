import { ref } from 'vue'
import type { Employee } from '@/types/Employee'
import rawEmployees from '@/data/employees.json'
import { STORAGE_KEYS } from '@/constants/storageKeys'

const employees = ref<Employee[]>([])

// Load employees from localStorage or fallback to default data
function loadEmployees() {
  const stored = localStorage.getItem(STORAGE_KEYS.employees)
  if (stored) {
    // Parse and set employees from stored JSON
    employees.value = JSON.parse(stored)
  } else {
    // Initialize with default employees and persist to localStorage
    employees.value = [...rawEmployees]
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees.value))
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
  }
}
