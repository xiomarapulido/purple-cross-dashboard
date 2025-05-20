<script setup lang="ts">
// Import reactive utilities from Vue
import { computed, watch } from 'vue'

// Define the props that the component accepts
const props = defineProps<{
  modelValue: boolean               // Controls whether the alert is visible (v-model)
  message: string                   // The message displayed inside the alert
  type?: 'success' | 'error'       // Alert type, defaults to 'success'
  duration?: number                 // Duration in milliseconds to auto-close the alert
}>()

// Define the events the component emits
const emit = defineEmits(['update:modelValue'])

// Computed property to determine the CSS class based on alert type
const alertClass = computed(() =>
  props.type === 'error' ? 'alert-danger' : 'alert-success'
)

// Watch for changes in modelValue
// If alert becomes visible and duration is set,
// schedule a timeout to auto-close the alert by emitting 'false'
watch(
  () => props.modelValue,
  (val) => {
    if (val && props.duration) {
      setTimeout(() => {
        emit('update:modelValue', false)
      }, props.duration)
    }
  }
)

// Function to manually close the alert when close button is clicked
function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <!-- Show alert only if modelValue is true -->
  <div v-if="modelValue" :class="['alert', alertClass, 'alert-dismissible', 'fade', 'show', 'scrollAlert']"
    role="alert">
    <!-- Display the alert message -->
    <span>{{ message }}</span>
    <!-- Close button triggers manual close -->
    <button type="button" class="btn-close ms-auto" aria-label="Close" @click="close"></button>
  </div>
</template>

<style scoped>
/* Styles for the alert box:
   - Limit max height and handle text wrapping
   - Position absolutely to float over other content
   - High z-index to ensure it's on top */
.scrollAlert {
  max-height: 50px;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  position: absolute;
  z-index: 9000;
}
</style>
