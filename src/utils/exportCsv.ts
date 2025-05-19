import { formatEmploymentDate, formatTerminationDate } from '@/utils/formatDates'
import type { Employee } from '@/types/Employee'
import { CSV_HEADERS } from '@/constants/employeeTableConstants'

export function exportEmployeesToCSV(employees: Employee[]) {
  const rows = employees.map((emp) => [
    `"${emp.code}"`,
    `"${emp.fullName}"`,
    `"${emp.department}"`,
    `"${emp.occupation}"`,
    `"${formatEmploymentDate(emp.dateOfEmployment)}"`,
    `"${formatTerminationDate(emp.terminationDate)}"`,
  ])

  let csvContent = CSV_HEADERS.join(',') + '\n'
  csvContent += rows.map((e) => e.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'employees.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
