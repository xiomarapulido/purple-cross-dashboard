<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  message: string
  type?: 'success' | 'error'
  duration?: number
}>()

const emit = defineEmits(['update:modelValue'])

const alertClass = computed(() =>
  props.type === 'error' ? 'alert-danger' : 'alert-success'
)

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

function close() {
  emit('update:modelValue', false)
}

</script>

<template>

  <div v-if="modelValue" :class="['alert', alertClass, 'alert-dismissible', 'fade', 'show', 'scrollAlert']"
    role="alert">
    <span>{{ message }}</span>
    <button type="button" class="btn-close ms-auto" aria-label="Close" @click="close"></button>
  </div>

</template>

<style scoped>
.scrollAlert {
  max-height: 50px;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  position: absolute;
  z-index: 9000;
}
</style>
