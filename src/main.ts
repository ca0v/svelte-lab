import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app

document.body.addEventListener("keydown", (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
  if (e.altKey) return
  if (e.metaKey) return

  if (e.ctrlKey || e.metaKey) {
    const key = e.key
    // get any element that has this key as a data-shortcut value
    const element = e.currentTarget.querySelector(
      `[data-shortcut="${key.toUpperCase()}"]`
    ) as HTMLElement
    if (element) {
      element.click()
      element.focus();
      e.preventDefault()
    }
  }
})

// intercept console.error and emit an event
const originalConsoleError = console.error
console.error = (...args: any[]) => {
  const event = new CustomEvent("console.error", {
    detail: args,
  })
  document.dispatchEvent(event)
  originalConsoleError(...args)
}
