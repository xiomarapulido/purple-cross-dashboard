import { ref } from 'vue'
import { STATUS } from '@/constants/status'

const alertVisible = ref(false)
const alertMessage = ref('')
const alertType = ref<STATUS.success | STATUS.error>(STATUS.success)

function showAlert(message: string, type: STATUS.success | STATUS.error = STATUS.success, isVisible = true) {
    alertMessage.value = message
    alertType.value = type
    alertVisible.value = isVisible
}

export function useGlobalAlert() {
    return {
        alertVisible,
        alertMessage,
        alertType,
        showAlert,
    }
}