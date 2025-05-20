import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useEmployeeTableLogic } from '@/composables/useEmployeeTableLogic'
import { SORT_KEYS } from '@/constants/employeeTableConstants'
import type { Employee } from '@/types/Employee'

const mockEmployees: Employee[] = [
  {
    id: 1,
    fullName: 'Xiomara Andrea',
    department: 'Engineering',
    occupation: 'Frontend Developer',
    dateOfEmployment: '2022-01-01',
    terminationDate: '',
  },
  {
    id: 2,
    fullName: 'Carlos Perez',
    department: 'HR',
    occupation: 'Recruiter',
    dateOfEmployment: '2021-05-15',
    terminationDate: '2023-05-01',
  },
  {
    id: 3,
    fullName: 'Ana Torres',
    department: 'Engineering',
    occupation: 'Backend Developer',
    dateOfEmployment: '2020-06-10',
    terminationDate: '',
  },
]

describe('useEmployeeTableLogic', () => {
  let employees: any
  let searchQuery: any
  let rowsPerPage: any
  let currentPage: any
  let sortKey: any
  let sortAsc: any

  beforeEach(() => {
    employees = ref([...mockEmployees])
    searchQuery = ref('')
    rowsPerPage = ref(2)
    currentPage = ref(1)
    sortKey = ref(SORT_KEYS.FULL_NAME)
    sortAsc = ref(true)
  })

  it('filters employees by search query', () => {
    searchQuery.value = 'Carlos'

    const { filteredEmployees } = useEmployeeTableLogic(
      employees, searchQuery, rowsPerPage, currentPage, sortKey, sortAsc
    )

    expect(filteredEmployees.value.length).toBe(1)
    expect(filteredEmployees.value[0].fullName).toBe('Carlos Perez')
  })

  it('sorts employees ascending by full name', () => {
    const { sortedEmployees } = useEmployeeTableLogic(
      employees, searchQuery, rowsPerPage, currentPage, sortKey, sortAsc
    )

    expect(sortedEmployees.value[0].fullName).toBe('Ana Torres')
    expect(sortedEmployees.value[1].fullName).toBe('Carlos Perez')
  })

  it('calculates total pages correctly', () => {
    const { totalPages } = useEmployeeTableLogic(
      employees, searchQuery, rowsPerPage, currentPage, sortKey, sortAsc
    )

    expect(totalPages.value).toBe(2)
  })

  it('changeSort toggles order if key is same', () => {
    const { changeSort } = useEmployeeTableLogic(
      employees, searchQuery, rowsPerPage, currentPage, sortKey, sortAsc
    )

    expect(sortAsc.value).toBe(true)
    changeSort('FULL_NAME')
    expect(sortAsc.value).toBe(false)
  })

  it('changeSort changes key and resets to ascending if different', () => {
    const { changeSort } = useEmployeeTableLogic(
      employees, searchQuery, rowsPerPage, currentPage, sortKey, sortAsc
    )

    sortAsc.value = false
    changeSort('DEPARTMENT')
    expect(sortKey.value).toBe(SORT_KEYS.DEPARTMENT)
    expect(sortAsc.value).toBe(true)
  })
})
