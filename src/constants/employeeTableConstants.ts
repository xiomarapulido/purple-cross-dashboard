export const EVENTS = {
  EDIT_EMPLOYEE: 'edit-employee',
  DELETE_EMPLOYEE: 'delete-employee',
  VIEW_EMPLOYEE: 'view-employee',
}

export const SORT_KEYS = {
  FULL_NAME: 'fullName',
  DEPARTMENT: 'department',
  OCCUPATION: 'occupation',
  DATE_OF_EMPLOYMENT: 'dateOfEmployment',
  TERMINATION_DATE: 'terminationDate',
} as const

export const CSV_HEADERS = [
  'Code',
  'Full Name',
  'Department',
  'Occupation',
  'Date of Employment',
  'Termination Date',
]
