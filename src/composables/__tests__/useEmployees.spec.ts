import { describe, it, vi, beforeEach, expect } from 'vitest'
import { useEmployees } from '@/composables/useEmployees'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { texts } from '@/i18n'
import * as apiSimulator from '@/utils/apiSimulator'

const mockEmployees = [
  { id: 1, fullName: 'John Doe', department: 'HR', occupation: 'Manager' },
  { id: 2, fullName: 'Jane Smith', department: 'IT', occupation: 'Developer' }
]

describe('useEmployees', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('loads employees from localStorage if present', async () => {
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(mockEmployees))

    const { employees, loadEmployees } = useEmployees()
    await loadEmployees()

    expect(employees.value).toEqual(mockEmployees)
  })

  it('fetches employees from API if not in localStorage', async () => {
    vi.spyOn(apiSimulator, 'simulateApiFetch').mockResolvedValue(mockEmployees)

    const { employees, loadEmployees } = useEmployees()
    await loadEmployees()

    expect(employees.value).toEqual(mockEmployees)
    expect(localStorage.getItem(STORAGE_KEYS.employees)).toBe(JSON.stringify(mockEmployees))
  })

  it('sets error message if API fetch fails', async () => {
    vi.spyOn(apiSimulator, 'simulateApiFetch').mockRejectedValue(new Error('API Error'))

    const { employees, loadEmployees, errorMessage } = useEmployees()
    await loadEmployees()

    expect(employees.value).toEqual([])
    expect(errorMessage.value).toBe(texts.employeeForm.messages.error)
  })

  it('saves employees to localStorage', () => {
    const { employees, saveEmployees } = useEmployees()

    employees.value = mockEmployees
    saveEmployees()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.employees) || '[]')
    expect(stored).toEqual(mockEmployees)
  })

  it('deletes employee by ID', async () => {
    const { employees, deleteEmployee } = useEmployees()
    vi.spyOn(apiSimulator, 'simulateApiDelete').mockResolvedValue(undefined)

    employees.value = [...mockEmployees]
    const result = await deleteEmployee(1)

    expect(result.success).toBe(true)
    expect(employees.value.length).toBe(1)
    expect(employees.value[0].id).toBe(2)
  })

  it('returns failure result if delete fails', async () => {
    const { employees, deleteEmployee } = useEmployees()
    vi.spyOn(apiSimulator, 'simulateApiDelete').mockRejectedValue(new Error('Delete failed'))

    employees.value = [...mockEmployees]
    const result = await deleteEmployee(1)

    expect(result.success).toBe(false)
    expect(employees.value.length).toBe(2)
  })
})
