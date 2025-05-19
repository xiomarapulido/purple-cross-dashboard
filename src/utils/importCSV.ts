import Papa from 'papaparse'
import type { Employee } from '@/types/Employee'

interface ImportResult {
    validEmployees: Employee[]
    errors: string[]
}

function isValidDate(value: string | null): boolean {
    if (!value) return true // Permitir nulos
    const parsed = Date.parse(value)
    return !isNaN(parsed)
}

export function importEmployeesFromCSV(
    file: File,
    existingEmployees: Employee[]
): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader()

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
                        const rowIndex = index + 2 // header = line 1

                        const code = row['Code']?.trim()
                        const fullName = row['Full Name']?.trim()
                        const department = row['Department']?.trim()
                        const occupation = row['Occupation']?.trim()
                        const dateOfEmploymentRaw = row['Date of Employment']?.trim() || null
                        const terminationDateRaw = row['Termination Date']?.trim() || null

                        // Validaciones obligatorias
                        if (!code || !fullName || !department || !occupation) {
                            errors.push(`Fila ${rowIndex}: Todos los campos obligatorios (Code, Full Name, Department, Occupation) deben estar presentes.`)
                            return
                        }

                        // Validación de duplicados
                        if (existingCodes.has(code)) {
                            errors.push(`Fila ${rowIndex}: El código "${code}" ya existe en el sistema.`)
                            return
                        }

                        if (newCodes.has(code)) {
                            errors.push(`Fila ${rowIndex}: El código "${code}" está duplicado en el archivo.`)
                            return
                        }

                        // Validación de fechas
                        if (!isValidDate(dateOfEmploymentRaw)) {
                            errors.push(`Fila ${rowIndex}: "Date of Employment" no tiene un formato de fecha válido.`)
                            return
                        }

                        if (!isValidDate(terminationDateRaw)) {
                            errors.push(`Fila ${rowIndex}: "Termination Date" no tiene un formato de fecha válido.`)
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
