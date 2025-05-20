<script setup lang="ts">
import type { Employee } from '@/types/Employee'
import { formatEmploymentDate, formatTerminationDate } from '@/utils/formatDates'
import { useTexts } from '@/i18n/useTexts'
const { texts } = useTexts()

const props = defineProps<{ employee: Employee | null, show: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

function close() {
  emit('close')
}

function backdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
    close()
  }
}
</script>

<template>
  <div v-if="show">
    <div class="modal-backdrop fade show" @click="backdropClick"></div>
    <div class="modal fade show" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-bg text-white">
            <h5 class="modal-title">Employee Details</h5>
            <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="close"></button>
          </div>
          <div class="modal-body" v-if="employee">
            <div class="d-flex flex-wrap">
              <div class="d-flex flex-column col-6">
                <dt>{{ texts.employeeTable.tableHeaders.name }}</dt>
                <dd>{{ employee.fullName }}</dd>
              </div>
              <div class="d-flex flex-column col-6">
                <dt>{{ texts.employeeTable.tableHeaders.department }}</dt>
                <dd>{{ employee.department }}</dd>
              </div>
              <div class="d-flex flex-column col-6">
                <dt>{{ texts.employeeTable.tableHeaders.position }}</dt>
                <dd>{{ employee.occupation }}</dd>
              </div>
              <div class="d-flex flex-column col-6">
                <dt>{{ texts.employeeTable.tableHeaders.hired }}</dt>
                <dd>{{ formatEmploymentDate(employee.dateOfEmployment) }}</dd>
              </div>
              <div class="d-flex flex-column col-6">
                <dt>{{ texts.employeeTable.tableHeaders.terminationDate }}</dt>
                <dd>{{ formatTerminationDate(employee.terminationDate) }}</dd>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
              {{ texts.employeeTable.tableHeaders.close }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-header-bg {
  background-color: var(--purple);
}

.modal-body {
  padding-left: 2.188rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  position: fixed;
  z-index: 1050;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
