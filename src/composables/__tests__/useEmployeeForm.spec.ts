import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEmployeeForm } from '@/composables/useEmployeeForm'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { nextTick } from 'vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' }
  }),
}))

vi.mock('@/utils/apiSimulator', () => ({
  simulateApiUpdate: vi.fn(),
}))

const employee = {
  id: 1,
  code: 'EMP01',
  fullName: 'Alice Smith',
  occupation: 'Manager',
  department: 'HR',
  dateOfEmployment: null,
  terminationDate: null
}

describe('useEmployeeForm', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('saves a new employee to localStorage', async () => {
    const { simulateApiUpdate } = await import('@/utils/apiSimulator')
    simulateApiUpdate.mockResolvedValue(true)

    const { saveEmployee } = useEmployeeForm()
    const result = await saveEmployee({ ...employee, id: 2 })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.employees)!)
    expect(result.success).toBe(true)
    expect(stored.length).toBe(1)
    expect(stored[0].id).toBe(2)
  })

  it('updates an existing employee in localStorage', async () => {
    const { simulateApiUpdate } = await import('@/utils/apiSimulator')
    simulateApiUpdate.mockResolvedValue(true)
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify([employee]))

    const { saveEmployee } = useEmployeeForm()
    const updated = { ...employee, fullName: 'Updated Name' }
    const result = await saveEmployee(updated)

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.employees)!)
    expect(result.success).toBe(true)
    expect(stored[0].fullName).toBe('Updated Name')
  })

  it('returns false if API update fails', async () => {
    const { simulateApiUpdate } = await import('@/utils/apiSimulator')
    simulateApiUpdate.mockRejectedValue(new Error('Failed'))

    const { saveEmployee } = useEmployeeForm()
    const result = await saveEmployee(employee)

    expect(result.success).toBe(false)
  })
})
