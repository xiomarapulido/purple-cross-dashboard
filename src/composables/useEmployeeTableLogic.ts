// composables/useEmployeeTableLogic.ts
import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Employee } from '@/types/Employee'
import { SORT_KEYS } from '@/constants/employeeTableConstants'
import { exportEmployeesToCSV } from '@/utils/exportCsv'

export function useEmployeeTableLogic(
    employees: Ref<Employee[]>,
    searchQuery: Ref<string>,
    rowsPerPage: Ref<number>,
    currentPage: Ref<number>,
    sortKey: Ref<keyof Employee>,
    sortAsc: Ref<boolean>
) {
    const filteredEmployees = computed(() => {
        const query = searchQuery.value.toLowerCase()
        return employees.value.filter(
            emp =>
                emp.fullName.toLowerCase().includes(query) ||
                emp.department.toLowerCase().includes(query) ||
                emp.occupation.toLowerCase().includes(query)
        )
    })

    const sortedEmployees = computed(() => {
        return [...filteredEmployees.value].sort((a, b) => {
            let valA = a[sortKey.value]
            let valB = b[sortKey.value]

            if (
                sortKey.value === SORT_KEYS.DATE_OF_EMPLOYMENT ||
                sortKey.value === SORT_KEYS.TERMINATION_DATE
            ) {
                valA = valA ? new Date(valA).getTime() : 0
                valB = valB ? new Date(valB).getTime() : 0
            } else {
                valA = valA?.toString().toLowerCase() ?? ''
                valB = valB?.toString().toLowerCase() ?? ''
            }

            if (valA < valB) return sortAsc.value ? -1 : 1
            if (valA > valB) return sortAsc.value ? 1 : -1
            return 0
        })
    })

    const paginatedEmployees = computed(() => {
        const start = (currentPage.value - 1) * rowsPerPage.value
        return sortedEmployees.value.slice(start, start + rowsPerPage.value)
    })

    const totalPages = computed(() =>
        Math.ceil(sortedEmployees.value.length / rowsPerPage.value)
    )

    function changeSort(key: keyof typeof SORT_KEYS) {
        const employeeKey = SORT_KEYS[key]
        if (sortKey.value === employeeKey) {
            sortAsc.value = !sortAsc.value
        } else {
            sortKey.value = employeeKey
            sortAsc.value = true
        }
    }

    function exportToCSV() {
        exportEmployeesToCSV(sortedEmployees.value)
    }

    return {
        filteredEmployees,
        sortedEmployees,
        paginatedEmployees,
        totalPages,
        changeSort,
        exportToCSV
    }
}
