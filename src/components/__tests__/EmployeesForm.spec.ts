import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EmployeeForm from '@/components/employees/EmployeesForm.vue'

// Mock composables y router
vi.mock('@/composables/useEmployeeForm', () => ({
  useEmployeeForm: () => ({
    formData: {
      code: '',
      fullName: '',
      occupation: '',
      department: '',
      dateOfEmployment: '',
      terminationDate: ''
    },
    errors: {},
    handleSubmit: (fn: Function) => fn,
    saveEmployee: vi.fn(),
  }),
}))

vi.mock('@/composables/useGlobalAlert', () => ({
  useGlobalAlert: () => ({
    showAlert: vi.fn(),
  }),
}))

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useRoute: () => ({
    params: {}
  }),
}))

vi.mock('@/constants/routes', () => ({
  ROUTES: { list: 'EmployeeList' }
}))

vi.mock('@/constants/events', () => ({
  EVENTS: { employeesUpdated: 'employeesUpdated' }
}))

vi.mock('@/constants/status', () => ({
  STATUS: { success: 'success', error: 'error' }
}))

vi.mock('@/i18n', () => ({
  texts: {
    employeeForm: {
      actions: { create: 'Create', edit: 'Edit', save: 'Save', createTetx: 'Create' },
      messages: { createSuccess: 'Created', editSuccess: 'Updated', error: 'Error' },
      fieldLabels: {
        code: 'Code',
        fullName: 'Full Name',
        occupation: 'Occupation',
        department: 'Department',
        dateOfEmployment: 'Start Date',
        terminationDate: 'End Date'
      },
      buttonLabels: {
        cancel: 'Cancel'
      }
    }
  }
}))

describe('EmployeeForm.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Create" title and button when no id param', () => {
    const wrapper = mount(EmployeeForm)
    expect(wrapper.find('.page-title').text()).toBe('Create')
    expect(wrapper.find('button[type="submit"]').text()).toBe('Create')
  })

  it('updates formData on input', async () => {
    const wrapper = mount(EmployeeForm)
    const input = wrapper.find('#code')
    await input.setValue('EMP001')
    expect(input.element.value).toBe('EMP001')
  })

  it('navigates back on cancel', async () => {
    const wrapper = mount(EmployeeForm)
    await wrapper.find('button[type="button"]').trigger('click')
    expect(mockPush).toHaveBeenCalledWith({ name: 'EmployeeList' })
  })
})
