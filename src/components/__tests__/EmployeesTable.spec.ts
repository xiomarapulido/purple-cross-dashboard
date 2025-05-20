import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmployeesTable from '@/components/employees/EmployeesTable.vue'
import type { Employee } from '@/types/Employee'

const mockEmployees: Employee[] = [
  {
    id: 1,
    fullName: 'Xiomara Andrea',
    department: 'Development',
    occupation: 'Frontend Developer',
    dateOfEmployment: '2022-01-01',
    terminationDate: null,
  },
  {
    id: 2,
    fullName: 'Juan Pérez',
    department: 'Sales',
    occupation: 'Sales Executive',
    dateOfEmployment: '2023-03-01',
    terminationDate: null,
  }
]

describe('EmployeesTable.vue', () => {
  it('renders the correct number of employees', () => {
    const wrapper = mount(EmployeesTable, {
      props: { employees: mockEmployees }
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(mockEmployees.length)
  })

  it('filters employees based on search input', async () => {
    const wrapper = mount(EmployeesTable, {
      props: { employees: mockEmployees }
    })
    const input = wrapper.get('input[type="text"]')
    await input.setValue('juan')
    await wrapper.vm.$nextTick()
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1)
    expect(rows[0].text().toLowerCase()).toContain('juan')
  })

})
