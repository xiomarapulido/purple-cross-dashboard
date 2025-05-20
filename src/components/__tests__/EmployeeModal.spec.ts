import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EmployeeDetailsModal from '@/components/employees/EmployeeModal.vue'

const mockEmployee = {
  fullName: 'Xiomara Andrea',
  department: 'Engineering',
  occupation: 'Frontend Developer',
  dateOfEmployment: '2022-05-15',
  terminationDate: null
}

vi.mock('@/i18n/useTexts', () => ({
  useTexts: () => ({
    texts: {
      employeeTable: {
        tableHeaders: {
          name: 'Name',
          department: 'Department',
          position: 'Position',
          hired: 'Hired',
          terminationDate: 'Termination Date',
          close: 'Close'
        }
      }
    }
  })
}))

vi.mock('@/utils/formatDates', () => ({
  formatEmploymentDate: (date: string) => `Hired on ${date}`,
  formatTerminationDate: (date: string | null) => date ? `Ended on ${date}` : 'Active'
}))

describe('EmployeeDetailsModal.vue', () => {
  it('renders when `show` is true', () => {
    const wrapper = mount(EmployeeDetailsModal, {
      props: {
        show: true,
        employee: mockEmployee
      }
    })

    expect(wrapper.find('.modal').exists()).toBe(true)
    expect(wrapper.text()).toContain('Xiomara Andrea')
    expect(wrapper.text()).toContain('Frontend Developer')
  })

  it('emits `close` on backdrop click', async () => {
    const wrapper = mount(EmployeeDetailsModal, {
      props: {
        show: true,
        employee: mockEmployee
      }
    })

    await wrapper.find('.modal-backdrop').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits `close` when close button is clicked', async () => {
    const wrapper = mount(EmployeeDetailsModal, {
      props: {
        show: true,
        employee: mockEmployee
      }
    })

    await wrapper.find('.btn-close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits `close` when footer button is clicked', async () => {
    const wrapper = mount(EmployeeDetailsModal, {
      props: {
        show: true,
        employee: mockEmployee
      }
    })

    await wrapper.find('.btn-secondary').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

})
