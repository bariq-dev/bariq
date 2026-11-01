export function copyText(text) {
  // Legacy path: synchronous, reliable inside a user click
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '0'
    area.style.left = '0'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.focus()
    area.select()
    area.setSelectionRange(0, text.length) // iOS
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    if (ok) return true
  } catch {
    // fall through
  }

  // Modern path (started synchronously, result not awaited)
  try {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => { })
      return true
    }
  } catch {
    // ignore
  }

  return false
}