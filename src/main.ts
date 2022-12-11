import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app

document.body.addEventListener("keydown", (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
  if (e.ctrlKey) return
  if (e.metaKey) return

  if (e.altKey) {
    const key = e.key
    // get any element that has this key as a data-shortcut value
    const element = e.currentTarget.querySelector(
      `[data-shortcut="${key.toUpperCase()}"]`
    ) as HTMLElement
    if (element) {
      element.focus();
      element.click()
      e.preventDefault()
    }
  }
})

window.addEventListener("error", (e: ErrorEvent) => {
  console.error(e)
  const err = document.createElement("div")
  err.innerText = e.message
  document.body.insertBefore(err, document.body.firstChild)
})
