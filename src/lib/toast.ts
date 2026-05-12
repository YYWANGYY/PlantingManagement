import { createApp, h, type Component } from 'vue'
import Toast from '@/components/Toast.vue'

interface ToastOptions {
  title?: string
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

let activeToastApp: ReturnType<typeof createApp> | null = null
let activeToastEl: HTMLDivElement | null = null

function destroyToast() {
  if (activeToastApp) {
    activeToastApp.unmount()
    activeToastApp = null
  }
  if (activeToastEl) {
    document.body.removeChild(activeToastEl)
    activeToastEl = null
  }
}

function showToast(options: ToastOptions) {
  // 先销毁已有 toast
  destroyToast()

  const div = document.createElement('div')
  document.body.appendChild(div)
  activeToastEl = div

  const app = createApp({
    render() {
      return h(Toast, {
        title: options.title,
        message: options.message,
        type: options.type || 'success',
        duration: options.duration ?? 4000,
        onClose: destroyToast,
      })
    },
  })
  app.mount(div)
  activeToastApp = app
}

export { showToast }
export type { ToastOptions }
