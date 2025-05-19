export const en = {
    employeesPage: {
        title: 'Employee Management',
        btnCreateEmployee: 'Create Employee',
        modalDeleteTitle: 'Confirm delete',
        modalDeleteMessage: 'Are you sure you want to delete',
        modalDeleteConfirm: 'Yes, delete',
        modalDeleteCancel: 'Cancel'
    },
    navbar: {
        title: 'Welcome,'
    },
    employeeForm: {
        validationMessages: {
            code: 'Code is required',
            codeInvalid: 'Code contains invalid characters',
            codeUnique: 'This code is already in use',
            fullName: 'Full name is required',
            fullNameInvalid: 'Full name contains invalid characters',
            occupation: 'Occupation is required',
            occupationInvalid: 'Occupation contains invalid characters',
            department: 'Department is required',
            departmentInvalid: 'Department contains invalid characters',
        },
        fieldLabels: {
            code: 'Code',
            fullName: 'Full Name',
            occupation: 'Occupation',
            department: 'Department',
            dateOfEmployment: 'Date of Employment',
            terminationDate: 'Termination Date',
        },
        buttonLabels: {
            cancel: 'Cancel',
            submit: {
                create: 'Create',
                save: 'Save',
            }
        },
        actions: {
            edit: 'Edit Employee',
            create: 'Create Employee',
            save: 'Save',
            createTetx: 'Create'
        }
    },
    employeeTable: {
        tableHeaders: {
            name: 'Name',
            department: 'Department',
            position: 'Position',
            hired: 'Date of Employment',
            terminationDate: 'Termination Date',
            actions: 'Actions',
            close: 'Close'
        },
        buttonLabels: {
            exportCSV: 'Export CSV',
            importCSV: 'Import CSV',
            previous: 'Previous',
            next: 'Next',
        },
        placeholders: {
            search: 'Search employees...',
        },
        messages: {
            rowsPerPage: 'Rows per page:',
            noResults: 'No results found.',
        }
    },
    utils: {
        importCSV: {
            success: 'Import completed successfully',
            errors: {
                row: 'Row',
                code: 'The code',
                alreadyExists: 'already exists in the system.',
                duplicated: 'is duplicated in the file.',
                invalidDate: 'Date of Employment" is not a valid date format.',
                invalidFormat: 'Termination Date" is not a valid date format.',
                specialCharacters: 'None of the required fields can contain special characters',
                required: 'All required fields (Code, Full Name, Department, Occupation) must be present.'
            }
        }
    }
}