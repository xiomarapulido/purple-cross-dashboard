import { ref } from 'vue'
import { STATUS } from '@/constants/status'

// Reactive state for controlling alert visibility
const alertVisible = ref(false)
// Reactive state for alert message text
const alertMessage = ref('')
// Reactive state for alert type: success or error
const alertType = ref<STATUS.success | STATUS.error>(STATUS.success)

/**
 * Updates the alert message, type, and visibility.
 * @param message - The alert message to display
 * @param type - The type of alert (success or error), defaults to success
 * @param isVisible - Whether the alert should be visible, defaults to true
 */
function showAlert(message: string, type: STATUS.success | STATUS.error = STATUS.success, isVisible = true) {
    alertMessage.value = message
    alertType.value = type
    alertVisible.value = isVisible
}

/**
 * Composable function to provide alert states and showAlert method globally.
 * Components can use this composable to trigger and display global alerts.
 */
export function useGlobalAlert() {
    return {
        alertVisible,
        alertMessage,
        alertType,
        showAlert,
    }
}
