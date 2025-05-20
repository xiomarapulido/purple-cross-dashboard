import { formatEmploymentDate, formatTerminationDate } from '@/utils/formatDates'
import type { Employee } from '@/types/Employee'
import { CSV_HEADERS } from '@/constants/employeeTableConstants'

// Function to export an array of Employee objects to a downloadable CSV file
export function exportEmployeesToCSV(employees: Employee[]) {
  // Map employees to rows with each field wrapped in quotes to handle commas or special characters
  const rows = employees.map((emp) => [
    `"${emp.code}"`,
    `"${emp.fullName}"`,
    `"${emp.department}"`,
    `"${emp.occupation}"`,
    `"${formatEmploymentDate(emp.dateOfEmployment)}"`, // Format employment date for CSV export
    `"${formatTerminationDate(emp.terminationDate)}"`, // Format termination date for CSV export
  ])

  // Create CSV content string starting with headers joined by commas and a newline
  let csvContent = CSV_HEADERS.join(',') + '\n'
  // Append all rows joined by commas and separated by newlines
  csvContent += rows.map((e) => e.join(',')).join('\n')

  // Create a Blob from CSV content for file download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  // Generate a temporary URL for the Blob
  const url = URL.createObjectURL(blob)
  // Create an anchor element to trigger download
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'employees.csv') // Set the filename for the download
  document.body.appendChild(link) // Append link to the DOM
  link.click()                   // Trigger download programmatically
  document.body.removeChild(link) // Clean up by removing the link element
  URL.revokeObjectURL(url)         // Release the temporary URL to free resources
}
