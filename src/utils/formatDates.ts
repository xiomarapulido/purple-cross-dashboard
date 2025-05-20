export function formatEmploymentDate(dateStr?: string): string {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today ? 'Employed soon' : 'Currently employed'
}

export function formatTerminationDate(dateStr?: string): string {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today ? 'Will be terminated' : 'Terminated'
}  