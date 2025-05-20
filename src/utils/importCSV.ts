import Papa from 'papaparse'
import type { Employee } from '@/types/Employee'
import { texts } from '@/i18n'

interface ImportResult {
    validEmployees: Employee[]
    errors: string[]
}

// Helper function to check if a date string is valid or empty (null)
function isValidDate(value: string | null): boolean {
    if (!value) return true
    const parsed = Date.parse(value)
    return !isNaN(parsed)
}

// Main function to import employees from a CSV file
export function importEmployeesFromCSV(
    file: File,
    existingEmployees: Employee[]
): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        // Regex to allow letters, numbers, spaces, dots, and hyphens (unicode aware)
        const specialCharRegex = /^[\p{L}0-9\s.-]+$/u

        reader.onload = (e) => {
            const text = e.target?.result as string

            Papa.parse(text, {
                header: true,            // Treat first row as header
                skipEmptyLines: true,    // Ignore empty lines in CSV
                complete: (result) => {
                    const rows = result.data as Record<string, string>[]
                    const errors: string[] = []
                    const validEmployees: Employee[] = []

                    // Collect existing employee codes for duplicate check
                    const existingCodes = new Set(existingEmployees.map(e => e.code).filter(Boolean))
                    const newCodes = new Set<string>()  // Track new codes to detect duplicates in CSV

                    rows.forEach((row, index) => {
                        const rowIndex = index + 2  // +2 to account for header row and 0-based index

                        // Extract and trim fields based on i18n labels
                        const code = row[texts.employeeForm.fieldLabels.code]?.trim()
                        const fullName = row[texts.employeeForm.fieldLabels.fullName]?.trim()
                        const department = row[texts.employeeForm.fieldLabels.department]?.trim()
                        const occupation = row[texts.employeeForm.fieldLabels.occupation]?.trim()
                        const dateOfEmploymentRaw = row[texts.employeeForm.fieldLabels.dateOfEmployment]?.trim() || null
                        const terminationDateRaw = row[texts.employeeForm.fieldLabels.terminationDate]?.trim() || null

                        // Validate required fields
                        if (!code || !fullName || !department || !occupation) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.required}`)
                            return
                        }

                        // Check for duplicates against existing employees
                        if (existingCodes.has(code)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.code} "${code}" ${texts.utils.importCSV.errors.alreadyExists}`)
                            return
                        }

                        // Check for duplicates within the CSV itself
                        if (newCodes.has(code)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.code} "${code}" ${texts.utils.importCSV.errors.duplicated}`)
                            return
                        }

                        // Validate date formats if present
                        if (!isValidDate(dateOfEmploymentRaw)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.invalidDate}`)
                            return
                        }

                        if (!isValidDate(terminationDateRaw)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.invalidFormat}`)
                            return
                        }

                        // Validate special characters in fields
                        if (![code, fullName, department, occupation].every(field => specialCharRegex.test(field))) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.specialCharacters}`)
                            return
                        }

                        // Add code to newCodes to prevent duplicate entries
                        newCodes.add(code)

                        // Create a valid Employee object and add it to the list
                        validEmployees.push({
                            id: crypto.randomUUID(),  // Generate unique ID for each imported employee
                            code,
                            fullName,
                            department,
                            occupation,
                            dateOfEmployment: dateOfEmploymentRaw,
                            terminationDate: terminationDateRaw
                        })
                    })

                    // Resolve promise with valid employees and error messages
                    resolve({ validEmployees, errors })
                }
            })
        }

        reader.readAsText(file)  // Read the CSV file as text to parse
    })
}
