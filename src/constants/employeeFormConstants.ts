export const ACTIONS = {
    edit: 'Edit Employee',
    create: 'Create Employee',
    save: 'Save',
    createTetx: 'Create'
}

export const VALIDATION_MESSAGES = {
    code: 'Code is required',
    codeInvalid: 'Code contains invalid characters',
    codeUnique: 'This code is already in use',
    fullName: 'Full name is required',
    fullNameInvalid: 'Full name contains invalid characters',
    occupation: 'Occupation is required',
    occupationInvalid: 'Occupation contains invalid characters',
    department: 'Department is required',
    departmentInvalid: 'Department contains invalid characters',
  }
  

export const FIELD_LABELS = {
    code: 'Code *',
    fullName: 'Full Name *',
    occupation: 'Occupation *',
    department: 'Department *',
    dateOfEmployment: 'Date of Employment',
    terminationDate: 'Termination Date',
}

export const BUTTON_LABELS = {
    cancel: 'Cancel',
    submit: {
        create: 'Create',
        save: 'Save',
    },
}