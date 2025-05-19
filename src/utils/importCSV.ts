import Papa from 'papaparse'
import type { Employee } from '@/types/Employee'
import { texts } from '@/i18n'

interface ImportResult {
    validEmployees: Employee[]
    errors: string[]
}

function isValidDate(value: string | null): boolean {
    if (!value) return true
    const parsed = Date.parse(value)
    return !isNaN(parsed)
}

export function importEmployeesFromCSV(
    file: File,
    existingEmployees: Employee[]
): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        const specialCharRegex = /^[\p{L}0-9\s.-]+$/u

        reader.onload = (e) => {
            const text = e.target?.result as string

            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const rows = result.data as Record<string, string>[]
                    const errors: string[] = []
                    const validEmployees: Employee[] = []

                    const existingCodes = new Set(existingEmployees.map(e => e.code).filter(Boolean))
                    const newCodes = new Set<string>()

                    rows.forEach((row, index) => {
                        const rowIndex = index + 2

                        const code = row[texts.employeeForm.fieldLabels.code]?.trim()
                        const fullName = row[texts.employeeForm.fieldLabels.fullName]?.trim()
                        const department = row[texts.employeeForm.fieldLabels.department]?.trim()
                        const occupation = row[texts.employeeForm.fieldLabels.occupation]?.trim()
                        const dateOfEmploymentRaw = row[texts.employeeForm.fieldLabels.dateOfEmployment]?.trim() || null
                        const terminationDateRaw = row[texts.employeeForm.fieldLabels.terminationDate]?.trim() || null

                        if (!code || !fullName || !department || !occupation) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.required}`)
                            return
                        }

                        if (existingCodes.has(code)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.code} "${code}" ${texts.utils.importCSV.errors.alreadyExists}`)
                            return
                        }

                        if (newCodes.has(code)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.code} "${code}" ${texts.utils.importCSV.errors.duplicated}`)
                            return
                        }

                        if (!isValidDate(dateOfEmploymentRaw)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.invalidDate}`)
                            return
                        }

                        if (!isValidDate(terminationDateRaw)) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.invalidFormat}`)
                            return
                        }

                        if (![code, fullName, department, occupation].every(field => specialCharRegex.test(field))) {
                            errors.push(`${texts.utils.importCSV.errors.row} ${rowIndex}: ${texts.utils.importCSV.errors.specialCharacters}`)
                            return
                        }

                        newCodes.add(code)

                        validEmployees.push({
                            id: crypto.randomUUID(),
                            code,
                            fullName,
                            department,
                            occupation,
                            dateOfEmployment: dateOfEmploymentRaw,
                            terminationDate: terminationDateRaw
                        })
                    })

                    resolve({ validEmployees, errors })
                }
            })
        }

        reader.readAsText(file)
    })
}
