<script lang="ts">
  const ID_MAP = "QWERTASDFGYUIOPHJKLZXCVBNM1234568790".split("")

  import { getEffectiveTransform } from "../lib/globals"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import type { CollageCellState, CollageData, Photo } from "../d.ts/index"
  import { reportExceptions, toast } from "../store/toasts"
  import { onMount } from "svelte"
  import { addCommand } from "../store/commands"

  export let sources: Array<{ id: string; url: string }> = []
  export let readonly = false
  export let editmode = !readonly
  export let transforms: CollageData

  let photoWheel: PhotoWheel

  let scope = `hexagon_spiral`

  export let width = "auto"

  $: setWorkareaWidthCssVariable(width)

  function setWorkareaWidthCssVariable(value: string) {
    document.documentElement.style.setProperty("--workarea-width", `${value}`)
  }

  export function focusPhotoWheel() {
    photoWheel?.focus()
  }

  function keyDownHandler(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    if (!editmode) return
    if (e.altKey) return
    if (e.metaKey) return
    if (e.ctrlKey) return

    function handled() {
      e.preventDefault()
      e.stopPropagation()
    }

    // get the image that is currently focused
    const image = getLastActiveCell()
    if (!image) return
    const target = image.parentElement.dataset.target
    // get the svgImage from this

    const sourceTransformIndex = transforms?.data?.findIndex(
      (d) => d.target === target
    )
    const sourceTransform =
      sourceTransformIndex >= 0 && transforms.data[sourceTransformIndex]

    if (sourceTransform && image) {
      let { width: w0 } = sourceTransform
      let x = 0
      let y = 0
      let width = 0
      let height = 0

      let resize = false
      switch (e.key) {
        default:
          if (!ID_MAP.includes(e.key.toLocaleUpperCase())) break
          const index = ID_MAP.indexOf(e.key.toLocaleUpperCase())
          const targetImage = transforms.data[index]
          if (!targetImage) break
          if (e.shiftKey) {
            focusTarget(targetImage.target)
            return handled()
          } else {
            swap(targetImage, sourceTransform)
            return handled()
          }
      }

      if (sourceTransform && image && resize) {
        if (e.shiftKey) {
          const currentTransform = getEffectiveTransform(
            sourceTransform.transform
          )
          const newTransform = `scale(${
            1 + width / w0
          }) ${currentTransform} translate(${x}px, ${y}px)`
          sourceTransform.transform = newTransform
        } else {
          sourceTransform.x += x || -width / 2
          sourceTransform.y += y || -height / 2
          sourceTransform.width += width
          sourceTransform.height += height
        }
        // force update
        transforms = transforms
        return handled()
      }
    }
  }

  function copy(from: CollageCellState, into: CollageCellState) {
    into.id = from.id
    into.baseurl = from.baseurl
    into.x = from.x
    into.y = from.y
    into.width = from.width
    into.height = from.height
    transforms = transforms
  }

  function swap(i1: CollageCellState, i2: CollageCellState) {
    const { id, baseurl, x, y, width, height } = i1

    i1.id = i2.id
    i1.baseurl = i2.baseurl
    i1.x = i2.x
    i1.y = i2.y
    i1.width = i2.width
    i1.height = i2.height

    i2.id = id
    i2.baseurl = baseurl
    i2.x = x
    i2.y = y
    i2.width = width
    i2.height = height

    // forces a render
    transforms = transforms
  }

  function swapHandler(e: CustomEvent) {
    const { mode, target1, target2 } = e.detail
    const t1 = transforms.data.find((i) => i.target === target1)
    if (!t1) {
      toast("no target image")
      return
    }

    const t2 = transforms.data.find((i) => i.target === target2)
    if (!t2) {
      toast("no active image")
      return
    }

    switch (mode) {
      case "copy":
        copy(t2, t1)
        break
      default:
        swap(t1, t2)
    }
  }

  function focusTarget(targetName: string) {
    const target = document.querySelector(`[data-target="${targetName}"] image`)
    // @ts-ignore
    target?.focus()
  }

  //$: reportExceptions(() => transforms && refreshTransforms(transforms.data))()

  function swapWithNextSibling(node: HTMLElement) {
    const parent = node.parentElement
    if (!parent) return
    const nextSibling = node.nextElementSibling
    if (nextSibling) {
      parent.insertBefore(nextSibling, node)
      console.log("swap", node, nextSibling)
    }
  }

  onMount(async () => {
    function getSourceTransform() {
      const target = getFocusCellIdentifier()
      if (!target) return

      return transforms?.data?.find((d) => d.target === target)
    }

    addCommand({
      event: "delete-cell",
      name: "Delete Cell",
      trigger: {
        key: "Delete",
        editmode: true,
      },
      disabled: () => {
        debugger
        return !getSourceTransform()
      },
      execute: () => {
        const sourceTransform = getSourceTransform()
        if (!sourceTransform) return
        sourceTransform.id = ""
        sourceTransform.baseurl = ""
        transforms = transforms
        return true
      },
    })

    addCommand({
      event: "swap-cell-up",
      name: "Bring Toward Top",
      trigger: {
        key: "Enter",
        isCtrl: true,
        editmode: true,
      },
      disabled: () => !getLastActiveCell(),
      execute: () => {
        const image = getLastActiveCell()
        if (!image) return
        swapWithNextSibling(image.parentElement)
        image.focus()
        return true
      },
    })

    // clone the current cell
    addCommand({
      name: "clone",
      event: "clone-cell",
      title: "Clone Current Cell",
      trigger: {
        key: "d",
        isCtrl: true,
        editmode: true,
      },
      execute: () => {
        // get the image that is currently focused
        const target = getFocusCellIdentifier()
        if (!target) return

        const sourceTransformIndex = transforms?.data?.findIndex(
          (d) => d.target === target
        )

        if (sourceTransformIndex < 0) return

        const clone = deepClone(transforms.data[sourceTransformIndex])
        clone.target = "i" + (transforms.data.length + 1)
        transforms.data.splice(sourceTransformIndex + 1, 0, clone)
        transforms = transforms
        return true
      },
    })

    {
      function rotate(cell: CollageCellState, rotation: number) {
        const currentStyle = getEffectiveTransform(cell.transform)
        cell.transform = `${currentStyle} rotate(${rotation}deg)`
      }

      function translate(cell: CollageCellState, x: number, y: number) {
        const currentStyle = getEffectiveTransform(cell.transform)
        cell.transform = `${currentStyle} translate(${x}px, ${y}px)`
      }

      function move(cell: CollageCellState, x: number, y: number) {
        cell.x += x
        cell.y += y
      }

      addCommand({
        event: "zoom-image-in",
        name: "Zoom Image In",
        trigger: {
          key: "+",
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          sourceTransform.width += 1
          sourceTransform.height += 1
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "zoom-image-out",
        name: "Zoom Image Out",
        trigger: {
          key: "-",
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          sourceTransform.width -= 1
          sourceTransform.height -= 1
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "zoom-in",
        name: "Zoom In",
        trigger: {
          key: "+",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const width = sourceTransform.width

          const currentTransform = getEffectiveTransform(
            sourceTransform.transform
          )
          sourceTransform.transform = `scale(${
            (1 + width) / width
          }) ${currentTransform}`

          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "zoom-out",
        name: "Zoom Out",
        trigger: {
          key: "-",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const width = sourceTransform.width

          const currentTransform = getEffectiveTransform(
            sourceTransform.transform
          )
          sourceTransform.transform = `scale(${
            width / (width + 1)
          }) ${currentTransform}`

          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-up",
        name: "Move Up",
        trigger: {
          key: "ArrowUp",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const y = -1
          translate(sourceTransform, 0, y)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-down",
        name: "Move Down",
        trigger: {
          key: "ArrowDown",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const y = 1
          translate(sourceTransform, 0, y)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-left",
        name: "Move Left",
        trigger: {
          key: "ArrowLeft",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const x = -1
          translate(sourceTransform, x, 0)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-right",
        name: "Move Right",
        trigger: {
          key: "ArrowRight",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const x = 1
          translate(sourceTransform, x, 0)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-image-up",
        name: "Move Image Up",
        trigger: {
          key: "ArrowUp",
          isShift: false,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const y = -1
          move(sourceTransform, 0, y)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-image-down",
        name: "Move Image Down",
        trigger: {
          key: "ArrowDown",
          isShift: false,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const y = 1
          move(sourceTransform, 0, y)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-image-left",
        name: "Move Image Left",
        trigger: {
          key: "ArrowLeft",
          isShift: false,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const x = -1
          move(sourceTransform, x, 0)
          transforms = transforms
          return true
        },
      })

      addCommand({
        event: "move-image-right",
        name: "Move Image Right",
        trigger: {
          key: "ArrowRight",
          isShift: false,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const x = 1
          move(sourceTransform, x, 0)
          transforms = transforms
          return true
        },
      })

      addCommand({
        name: "Rotate Clockwise",
        event: "rotate-clockwise",
        trigger: {
          key: ">",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const rotation = 15
          rotate(sourceTransform, rotation)
          transforms = transforms
          return true
        },
      })

      addCommand({
        name: "Rotate Counter-Clockwise",
        event: "rotate-counter-clockwise",
        trigger: {
          key: "<",
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const rotation = -15
          rotate(sourceTransform, rotation)
          transforms = transforms
          return true
        },
      })
    }
  })

  let lastActiveCell: SVGImageElement

  function getLastActiveCell() {
    const image = document.activeElement as SVGImageElement
    if (image instanceof SVGImageElement) {
      lastActiveCell = image
      return image
    }
    return lastActiveCell
  }

  function getFocusCellIdentifier() {
    const image = getLastActiveCell()
    if (!image) return
    const target = image.parentElement.dataset.target
    return target
  }

  function deepClone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
  }
</script>

<div class={scope + " workarea"} on:keydown={reportExceptions(keyDownHandler)}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <section>
    <svg
      class:border={editmode}
      viewBox="-100 -100 200 200"
      stroke-width="0"
      fill="#000"
    >
      {#if transforms?.data}
        {#each transforms.data as transform, i}
          <SvgImage
            {editmode}
            {readonly}
            fast={editmode}
            href={transform.baseurl}
            clipPath={transform.clipPath}
            x={transform.x}
            y={transform.y}
            width={transform.width}
            height={transform.height}
            on:swap={swapHandler}
            on:drop={(e) => {
              const { id, url } = e.detail
              transform.id = id
              transform.baseurl = url
              transforms = transforms
            }}
            target={`${transform.target}`}
            hotkey={ID_MAP[i]}
            style={transform.transform}
            background={{
              stroke: transform.background?.stroke || "none",
              fill: transform.background?.fill || "none",
            }}
          />
        {/each}
      {/if}
    </svg>
  </section>
  {#if !readonly}
    <div class="clone" class:dragging={false}>Clone Here</div>
  {/if}
</div>
{#if !readonly && editmode && transforms}
  <slot />
  <PhotoWheel
    {sources}
    bind:this={photoWheel}
    on:goto={(data) => {
      const { key } = data.detail
      const index = ID_MAP.indexOf(key.toLocaleUpperCase())
      if (index < 0) return
      const transform = transforms.data[index]
      if (transform) {
        focusTarget(transform.target)
      }
    }}
    on:keydown={(data) => {
      const { key, source } = data.detail
      const index = ID_MAP.indexOf(key.toLocaleUpperCase())
      if (index < 0) return
      const targetImage = transforms.data[index]
      if (targetImage) {
        targetImage.id = source.id
        targetImage.baseurl = source.url
        // forces a render
        transforms = transforms
      }
    }}
  />
{/if}

<style>
  svg {
    box-sizing: border-box;
    position: relative;
    overflow: visible;
    overflow: hidden;
    width: 100%;
  }

  svg.border {
    outline: 1px solid var(--color-border);
  }

  section {
    display: flex;
    grid-auto-flow: row;
    grid-template-columns: 80cqmin;
    justify-content: center;
  }

  .clone {
    position: absolute;
    top: 0;
    left: 0;
    height: 128px;
    width: 128px;
    background-size: cover;
    opacity: 0.5;
    /* center text vertically */
    display: flex;
    align-items: center;
    justify-content: center;
    /* prevent selection */
    user-select: none;
    visibility: hidden;
    clip-path: url(#clip2);
  }

  .clone.dragging {
    visibility: visible;
  }

  .toolbar {
    display: flex;
    justify-content: center;
    gap: 0.5em;
    margin: 0.5em;
  }

  .workarea {
    container-type: inline-size;
    width: var(--workarea-width);
    margin: 0 auto;
  }
</style>
