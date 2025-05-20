import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ConfirmModal from '@/components/employees/ConfirmDeleteModal.vue' 

describe('ConfirmModal.vue', () => {
  const defaultProps = {
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this item?',
    confirmText: 'Yes, delete',
    cancelText: 'Cancel'
  }

  it('renders title and message', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain(defaultProps.title)
    expect(wrapper.text()).toContain(defaultProps.message)
  })

  it('renders custom button texts', () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps
    })

    expect(wrapper.find('button.btn-secondary').text()).toBe(defaultProps.cancelText)
    expect(wrapper.find('button.btn.main-bg').text()).toBe(defaultProps.confirmText)
  })

  it('emits `cancel` when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps
    })

    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits `cancel` when close button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps
    })

    await wrapper.find('.btn-close').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits `confirm` when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      props: defaultProps
    })

    await wrapper.find('button.btn.main-bg').trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })
})
