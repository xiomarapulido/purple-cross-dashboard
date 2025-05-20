import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import EmployeesPage from '@/pages/EmployeesPage.vue'
import { emitter } from '@/eventBus'

const loadEmployeesMock = vi.fn()

vi.mock('@/composables/useEmployees', () => ({
  useEmployees: () => ({
    employees: ref([]),
    loadEmployees: loadEmployeesMock,
    deleteEmployee: vi.fn(() => Promise.resolve({ success: true })),
    saveEmployees: vi.fn(),
    errorMessage: ref(null)
  })
}))

vi.mock('@/eventBus', () => ({
  emitter: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }
}))

vi.mock('@/composables/useGlobalAlert', () => ({
  useGlobalAlert: () => ({
    showAlert: vi.fn()
  })
}))

describe('EmployeesPage', () => {
  it('calls loadEmployees on mount', () => {
    loadEmployeesMock.mockClear()  // limpia llamadas previas
    const wrapper = mount(EmployeesPage)
    expect(loadEmployeesMock).toHaveBeenCalled()
  })

  it('registers and unregisters event listener', () => {
    const wrapper = mount(EmployeesPage)
    expect(emitter.on).toHaveBeenCalledWith(expect.any(String), expect.any(Function))
    wrapper.unmount()
    expect(emitter.off).toHaveBeenCalledWith(expect.any(String), expect.any(Function))
  })
})
