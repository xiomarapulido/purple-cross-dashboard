import { describe, it, expect } from 'vitest'
import { useGlobalAlert } from '@/composables/useGlobalAlert' 
import { STATUS } from '@/constants/status'

describe('useGlobalAlert composable', () => {
  it('has correct initial state', () => {
    const { alertVisible, alertMessage, alertType } = useGlobalAlert()

    expect(alertVisible.value).toBe(false)
    expect(alertMessage.value).toBe('')
    expect(alertType.value).toBe(STATUS.success)
  })

  it('updates alert message and shows alert with default type', () => {
    const { alertMessage, alertType, alertVisible, showAlert } = useGlobalAlert()

    showAlert('Test message')

    expect(alertMessage.value).toBe('Test message')
    expect(alertType.value).toBe(STATUS.success)
    expect(alertVisible.value).toBe(true)
  })

  it('sets alert type to error correctly', () => {
    const { alertType, showAlert } = useGlobalAlert()

    showAlert('Something went wrong', STATUS.error)

    expect(alertType.value).toBe(STATUS.error)
  })

  it('hides the alert if isVisible is false', () => {
    const { alertVisible, showAlert } = useGlobalAlert()

    showAlert('This should be hidden', STATUS.success, false)

    expect(alertVisible.value).toBe(false)
  })
})
