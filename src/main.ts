import './app.css'
// @ts-ignore
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app') as HTMLElement
})

window.onerror = (...args) => {
  alert("Error!");
  console.error(args);
  return false;
}
export default app

