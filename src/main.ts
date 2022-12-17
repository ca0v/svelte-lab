import './app.css'
import App from './App.svelte'
import { toast } from './store/toasts'

const app = new App({
  target: document.getElementById('app')
})

export default app

let lastKeyPressed = ""
document.addEventListener("keydown", (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
  const previousKeyPressed = lastKeyPressed;
  lastKeyPressed = e.key;

  // create a shortcut key by combining the alt, ctrl, and meta keys with the last key pressed
  const shortcut = [
    previousKeyPressed || "",
    e.altKey ? "Alt" : "",
    e.ctrlKey ? "Ctrl" : "",
    e.metaKey ? "Meta" : "",
    e.shiftKey ? "Shift" : "",
    lastKeyPressed || "",
  ].filter(v => !!v).join(">")

  console.log(previousKeyPressed, lastKeyPressed, shortcut);

  // get any element that has this key as a data-shortcut value
  const element = e.currentTarget.querySelector(
    `[data-shortcut="${shortcut}"]`
  ) as HTMLElement
  if (element) {
    toast(element.title ?? element.dataset.shortcut)
    if ("INPUT.SELECT.TEXTAREA".includes(element.tagName)) {
      element.focus()
    }
    element.click()
    e.preventDefault()
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
