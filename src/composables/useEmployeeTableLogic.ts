import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Employee } from '@/types/Employee'
import { SORT_KEYS } from '@/constants/employeeTableConstants'
import { formatEmploymentDate, formatTerminationDate } from '@/utils/formatDates'

/**
 * Composable that encapsulates filtering, sorting, and pagination logic
 * for an employee table.
 *
 * @param employees - Reactive reference to the full list of employees
 * @param searchQuery - Reactive reference to the search/filter string
 * @param rowsPerPage - Number of rows to show per page
 * @param currentPage - Current page number for pagination
 * @param sortKey - The employee property key to sort by
 * @param sortAsc - Whether sorting is ascending (true) or descending (false)
 * @returns Computed properties and methods to handle table data logic
 */
export function useEmployeeTableLogic(
    employees: Ref<Employee[]>,
    searchQuery: Ref<string>,
    rowsPerPage: Ref<number>,
    currentPage: Ref<number>,
    sortKey: Ref<keyof Employee>,
    sortAsc: Ref<boolean>
) {
    // Filter employees by search query matching fullName, department, or occupation
    const filteredEmployees = computed(() => {
        const query = searchQuery.value.toLowerCase()
      
        return employees.value.filter(emp => {
          const fullName = emp.fullName.toLowerCase()
          const department = emp.department.toLowerCase()
          const occupation = emp.occupation.toLowerCase()
      
          const formattedEmployment = formatEmploymentDate(emp.dateOfEmployment).toLowerCase()
          const formattedTermination = formatTerminationDate(emp.terminationDate).toLowerCase()
      
          return (
            fullName.includes(query) ||
            department.includes(query) ||
            occupation.includes(query) ||
            formattedEmployment.includes(query) ||
            formattedTermination.includes(query)
          )
        })
      })      

    // Sort the filtered employees based on the current sort key and order
    const sortedEmployees = computed(() => {
        return [...filteredEmployees.value].sort((a, b) => {
            let valA = a[sortKey.value]
            let valB = b[sortKey.value]

            // For date fields, convert to timestamps for accurate comparison
            if (
                sortKey.value === SORT_KEYS.DATE_OF_EMPLOYMENT ||
                sortKey.value === SORT_KEYS.TERMINATION_DATE
            ) {
                valA = valA ? new Date(valA).getTime() : 0
                valB = valB ? new Date(valB).getTime() : 0
            } else {
                // For strings, compare lowercase values
                valA = valA?.toString().toLowerCase() ?? ''
                valB = valB?.toString().toLowerCase() ?? ''
            }

            // Return sorting order based on ascending/descending flag
            if (valA < valB) return sortAsc.value ? -1 : 1
            if (valA > valB) return sortAsc.value ? 1 : -1
            return 0
        })
    })

    // Paginate the sorted list of employees for current page
    const paginatedEmployees = computed(() => {
        const start = (currentPage.value - 1) * rowsPerPage.value
        return sortedEmployees.value.slice(start, start + rowsPerPage.value)
    })

    // Calculate total number of pages based on filtered and sorted employees
    const totalPages = computed(() =>
        Math.ceil(sortedEmployees.value.length / rowsPerPage.value)
    )

    /**
     * Changes the sort key. If the new key is the same as the current,
     * toggles the sort order; otherwise, sets ascending sort on new key.
     * @param key - The new sort key from SORT_KEYS
     */
    function changeSort(key: keyof typeof SORT_KEYS) {
        const employeeKey = SORT_KEYS[key]
        if (sortKey.value === employeeKey) {
            sortAsc.value = !sortAsc.value
        } else {
            sortKey.value = employeeKey
            sortAsc.value = true
        }
    }

    return {
        filteredEmployees,
        sortedEmployees,
        paginatedEmployees,
        totalPages,
        changeSort
    }
}
