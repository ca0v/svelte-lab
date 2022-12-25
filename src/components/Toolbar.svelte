<div class="toolbar">
  <div class="command-button">
    <label>Name of Command</label>
    <input
      type="button"
      title="Describe This Command"
      value="Ctrl+Alt+Shift+P"
    />
  </div>
  <div class="command-button">
    <label>Name of Command</label>
    <button title="Describe This Command">Ctrl+Alt+Shift+P</button>
  </div>
  <div class="command-button">
    <label>Name of Command</label>
    <button title="Describe This Command">Ctrl+Alt+Shift+P</button>
  </div>
  <div class="command-button">
    <label>Name of Command</label>
    <button title="Describe This Command">Ctrl+Alt+Shift+P</button>
  </div>
</div>

<style>
  .toolbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, min(20cqw, 10rem));
    column-gap: 2px;
    justify-content: center;
  }

  .command-button {
    display: grid;
    grid-template-rows: 1fr 1fr;
    row-gap: 2px;
  }

  .command-button label {
    width: min(20cqw, 10rem);
    text-align: center;
  }

  .command-button input[type="button"],
  .command-button button {
    width: min(20cqw, 10rem);
    word-wrap: break-word;
  }
</style>
