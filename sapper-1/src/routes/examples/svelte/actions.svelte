<script lang="ts">
  let defaultTitle = "click me";

  function action1(node: HTMLDivElement) {
    node.classList.add("action");
    node.style.background = "black";

    node.tabIndex = -1;
    node.addEventListener("focus", () => {
      node.style.color = "red";
    });
    node.addEventListener("focusout", () => {
      node.style.color = "";
      defaultTitle = "click me again";
    });
  }

  function action2(node: HTMLElement, title: string) {
    node.title = title;

    return {
      update: (title: string) => {
        node.title = title;
      },
    };
  }
</script>

<style>
  div {
    color: blue;
  }

  .action {
    border: 1px solid white;
    background-color: black;
    color: green;
  }

  dummy {
    /* .action remove as dead code without this reference */
    display: none;
  }
</style>

<h1>Actions</h1>
<dummy class="action" />
<div>Div without action</div>
<div use:action1 use:action2={defaultTitle}>Div with action</div>
