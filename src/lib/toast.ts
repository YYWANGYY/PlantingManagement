interface ToastOptions {
  title?: string
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

let activeToastEl: HTMLDivElement | null = null
let activeTimer: ReturnType<typeof setTimeout> | null = null

function destroyToast() {
  if (activeTimer) {
    clearTimeout(activeTimer)
    activeTimer = null
  }
  if (activeToastEl) {
    activeToastEl.remove()
    activeToastEl = null
  }
}

function showToast(options: ToastOptions) {
  // 先销毁已有 toast
  destroyToast()

  const type = options.type || 'success'
  const duration = options.duration ?? 4000

  const borderColorMap: Record<string, string> = {
    success: '#a7f3d0',
    warning: '#fde68a',
    error: '#fecaca',
    info: '#bfdbfe',
  }
  const iconColorMap: Record<string, string> = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
  const iconSvgMap: Record<string, string> = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  }

  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed; right: 24px; top: 24px; z-index: 99999;
    display: flex; align-items: flex-start; gap: 12px;
    max-width: 420px; padding: 16px; border-radius: 8px;
    border: 1px solid ${borderColorMap[type] || borderColorMap.success};
    background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    animation: toast-in 0.3s ease-out;
  `

  const iconEl = document.createElement('div')
  iconEl.style.cssText = `flex-shrink: 0; margin-top: 2px; color: ${iconColorMap[type] || iconColorMap.success};`
  iconEl.innerHTML = iconSvgMap[type] || iconSvgMap.success
  container.appendChild(iconEl)

  const textEl = document.createElement('div')
  textEl.style.cssText = 'flex: 1; min-width: 0;'
  if (options.title) {
    const titleEl = document.createElement('p')
    titleEl.style.cssText = 'margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;'
    titleEl.textContent = options.title
    textEl.appendChild(titleEl)
  }
  const msgEl = document.createElement('p')
  msgEl.style.cssText = 'margin: 0; font-size: 14px; color: #6b7280; white-space: pre-wrap;'
  msgEl.textContent = options.message
  textEl.appendChild(msgEl)
  container.appendChild(textEl)

  const closeBtn = document.createElement('button')
  closeBtn.style.cssText = 'flex-shrink: 0; background: none; border: none; cursor: pointer; color: #9ca3af; padding: 0; line-height: 1;'
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  closeBtn.onclick = () => destroyToast()
  container.appendChild(closeBtn)

  // Add animation keyframes
  if (!document.getElementById('toast-keyframes')) {
    const style = document.createElement('style')
    style.id = 'toast-keyframes'
    style.textContent = `
      @keyframes toast-in {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(container)
  activeToastEl = container

  if (duration > 0) {
    activeTimer = setTimeout(() => {
      container.style.transition = 'opacity 0.2s, transform 0.2s'
      container.style.opacity = '0'
      container.style.transform = 'translateX(100%)'
      setTimeout(() => destroyToast(), 200)
    }, duration)
  }
}

export { showToast }
export type { ToastOptions }
