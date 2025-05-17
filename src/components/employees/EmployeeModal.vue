<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Employee } from '@/types/Employee'

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
    <!-- Backdrop separado -->
    <div
      class="modal-backdrop fade show"
      @click="backdropClick"
    ></div>

    <!-- Modal centrado -->
    <div
      class="modal fade show"
      tabindex="-1"
      aria-modal="true"
      role="dialog"
      style="display: block;"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Employee Details</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
              @click="close"
            ></button>
          </div>
          <div class="modal-body" v-if="employee">
            <dl class="row">
              <dt class="col-sm-4">Name</dt>
              <dd class="col-sm-8">{{ employee.fullName }}</dd>

              <dt class="col-sm-4">Department</dt>
              <dd class="col-sm-8">{{ employee.department }}</dd>

              <dt class="col-sm-4">Position</dt>
              <dd class="col-sm-8">{{ employee.occupation }}</dd>

              <dt class="col-sm-4">Date of Employment</dt>
              <dd class="col-sm-8">{{ employee.dateOfEmployment ?? '-' }}</dd>

              <dt class="col-sm-4">Termination Date</dt>
              <dd class="col-sm-8">{{ employee.terminationDate ?? '-' }}</dd>
            </dl>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
