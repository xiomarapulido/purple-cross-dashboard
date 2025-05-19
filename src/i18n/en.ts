export const en = {
    employeesPage: {
        title: 'Employee Management',
        btnCreateEmployee: 'Create Employee'
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
            code: 'Code *',
            fullName: 'Full Name *',
            occupation: 'Occupation *',
            department: 'Department *',
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
    }
}