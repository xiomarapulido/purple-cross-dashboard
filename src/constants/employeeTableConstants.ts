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

export const TABLE_HEADERS = {
  name: 'Name',
  department: 'Department',
  position: 'Position',
  hired: 'Date of Employment',
  terminationDate: 'Termination Date',
  actions: 'Actions',
}

export const BUTTON_LABELS = {
  exportCSV: 'Export CSV',
  previous: 'Previous',
  next: 'Next',
}

export const PLACEHOLDERS = {
  search: 'Search employees...',
}

export const MESSAGES = {
  rowsPerPage: 'Rows per page:',
  noResults: 'No results found.',
}

export const CSV_HEADERS = [
  'Full Name',
  'Department',
  'Occupation',
  'Date of Employment',
  'Termination Date',
]
