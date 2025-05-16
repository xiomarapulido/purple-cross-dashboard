<script setup lang="ts">
import EmployeesTable from '@/components/employees/EmployeesTable.vue'
import employees from '@/data/employees.json'
</script>

<template>
    <div>
        <EmployeesTable :employees="employees" />
    </div>
</template>
