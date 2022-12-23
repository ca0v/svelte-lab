<script lang="ts">
  const ID_MAP = "QWERTASDFGYUIOPHJKLZXCVBNM1234568790".split("")

  import { getEffectiveTransform, hasFocus, log } from "../lib/globals"

  import PhotoWheel from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import type {
    BBox,
    CollageCellState,
    CollageData,
    Photo,
  } from "../d.ts/index"
  import { reportExceptions, toast } from "../store/toasts"
  import { onDestroy, onMount } from "svelte"
  import { addCommand, removeCommand } from "../store/commands"

  export let sources: Array<{ id: string; url: string }> = []
  export let readonly = false
  export let editmode = !readonly
  export let transforms: CollageData

  let photoWheel: PhotoWheel
  let svgElement: SVGSVGElement

  let scope = `hexagon_spiral`

  export let width = "auto"

  function setWorkareaWidthCssVariable(value: string) {
    document.documentElement.style.setProperty("--workarea-width", `${value}`)
  }

  export function focusPhotoWheel() {
    photoWheel?.focus()
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

  $: setWorkareaWidthCssVariable(width)

  // this need get reset at some point...
  let lastActiveCell: SVGImageElement

  function getLastActiveCell() {
    const image = document.activeElement as SVGImageElement
    if (image instanceof SVGImageElement) {
      lastActiveCell = image
      return image
    }
    return lastActiveCell
  }

  onMount(async () => {
    function getSourceTransform() {
      const target = getFocusCellIdentifier()
      if (!target) return

      return transforms?.data?.find((d) => d.target === target)
    }

    ID_MAP.forEach((key, index) => {
      addCommand({
        event: `swap-with-cell-${key}`,
        name: `Swap with ${key}`,
        trigger: {
          key: key.toLocaleLowerCase(),
          editmode: true,
        },
        disabled: () =>
          !transforms?.data?.[index] ||
          transforms.data[index] == getSourceTransform(),
        execute: () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const targetImage = transforms.data[index]
          swap(targetImage, sourceTransform)
          focusTarget(targetImage.target)
          getFocusCellIdentifier()
          return true
        },
      })

      addCommand({
        event: `focus-cell-${key}`,
        name: `Focus ${key}`,
        trigger: {
          key: key.toLocaleUpperCase(),
          isShift: true,
          editmode: true,
        },
        disabled: () => !transforms?.data?.[index],
        execute: () => {
          const targetImage = transforms.data[index]
          focusTarget(targetImage.target)
          getLastActiveCell()
          return true
        },
      })
    })

    addCommand({
      event: "delete-cell",
      name: "Delete Cell",
      trigger: {
        key: "Delete",
        isShift: true,
        editmode: true,
      },
      disabled: () => !getSourceTransform(),
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

      function rotateImage(cell: SVGImageElement, rotation: number) {
        const currentStyle = getEffectiveTransform(cell.style.transform)
        cell.style.transform = `${currentStyle} rotate(${rotation}deg)`
      }

      function move(cell: CollageCellState, box: BBox) {
        cell.x += box.x || 0
        cell.y += box.y || 0
        cell.width += box.width || 0
        cell.height += box.height || 0
      }

      function zoom(cell: CollageCellState, scale: { dx: number; dy: number }) {
        const { x: x0, y: y0, width: w0, height: h0 } = cell
        const { dx, dy } = scale
        const dw = w0 * (dx / x0)
        const dh = h0 * (dy / y0)
        move(cell, { x: dx, y: dy, width: dw, height: dh })
      }

      function createMoveHandler(box: BBox) {
        return () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return

          const moveImage = false
          if (moveImage) {
            move(sourceTransform, box)
          } else {
            let { x, y, width, height } = box
            x = x || 0
            y = y || 0
            width = width || 0
            height = height || 0

            const w0 = sourceTransform.width
            const h0 = sourceTransform.height

            const currentStyle = getEffectiveTransform(
              sourceTransform.transform
            )

            const translateTransform = `translate(${x}px, ${y}px)`
            let scaleTransform = "scale(1,1)"

            if (width < 0) {
              scaleTransform += ` scale(${w0 / (w0 - width)}, 1)`
            } else if (width > 0) {
              scaleTransform += ` scale(${(w0 + width) / w0}, 1)`
            }

            if (height < 0) {
              scaleTransform += ` scale(1, ${h0 / (h0 - height)})`
            } else if (height > 0) {
              scaleTransform += ` scale(1, ${(h0 + height) / h0})`
            }

            sourceTransform.transform = `${currentStyle} ${scaleTransform} ${translateTransform}`
          }
          transforms = transforms
          return true
        }
      }

      addCommand({
        event: "grow-image-right",
        name: "Grow Image Right",
        trigger: {
          key: "ArrowRight",
          isAlt: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ x: 1, width: 2 }),
      })

      addCommand({
        event: "shrink-image-right",
        name: "Shrink Image Right",
        trigger: {
          key: "ArrowLeft",
          isAlt: true,
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ x: -1, width: -2 }),
      })

      addCommand({
        event: "grow-image-left",
        name: "Grow Image Left",
        trigger: {
          key: "ArrowLeft",
          isAlt: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ x: -1, width: 2 }),
      })

      addCommand({
        event: "shrink-image-left",
        name: "Shrink Image Left",
        trigger: {
          key: "ArrowRight",
          isAlt: true,
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ x: 1, width: -2 }),
      })

      addCommand({
        event: "grow-image-down",
        name: "Grow Image Down",
        trigger: {
          key: "ArrowDown",
          isAlt: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ y: 1, height: 2 }),
      })

      addCommand({
        event: "shrink-image-down",
        name: "Shrink Image Down",
        trigger: {
          key: "ArrowUp",
          isAlt: true,
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ y: -1, height: -2 }),
      })

      addCommand({
        event: "grow-image-up",
        name: "Grow Image Up",
        trigger: {
          key: "ArrowUp",
          isAlt: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ y: -1, height: 2 }),
      })

      addCommand({
        event: "shrink-image-up",
        name: "Shrink Image Up",
        trigger: {
          key: "ArrowDown",
          isAlt: true,
          isShift: true,
          editmode: true,
        },
        disabled: () => !getSourceTransform(),
        execute: createMoveHandler({ y: 1, height: -2 }),
      })

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
          const dx = -1
          const dy = -1
          zoom(sourceTransform, { dx, dy })
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
          const dx = 1
          const dy = 1
          zoom(sourceTransform, { dx, dy })
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
        execute: createMoveHandler({ width: 1, height: 1 }),
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
        execute: createMoveHandler({ width: -1, height: -1 }),
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
          move(sourceTransform, { y })
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
          move(sourceTransform, { y })
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
          move(sourceTransform, { x })
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
          move(sourceTransform, { x })
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
          const rotation = 6
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
          const rotation = -6
          rotate(sourceTransform, rotation)
          transforms = transforms
          return true
        },
      })

      addCommand({
        name: "Rotate Image Clockwise",
        event: "rotate-image-clockwise",
        trigger: {
          key: ".",
          isShift: false,
          editmode: true,
        },
        disabled: () => !hasFocus(svgElement) || !getLastActiveCell(),
        execute: () => {
          const target = getLastActiveCell()
          if (!target) return
          const rotation = 6
          rotateImage(target, rotation)
          transforms = transforms
          return true
        },
      })

      addCommand({
        name: "Rotate Image Counter-Clockwise",
        event: "rotate-image-counter-clockwise",
        trigger: {
          key: ",",
          isShift: false,
          editmode: true,
        },
        disabled: () => !hasFocus(svgElement) || !getLastActiveCell(),
        execute: () => {
          const target = getLastActiveCell()
          if (!target) return
          const rotation = -6
          rotateImage(target, rotation)
          transforms = transforms
          return true
        },
      })
    }
  })

  onDestroy(() => {
    removeCommand("clone-cell")
    removeCommand("delete-cell")
    removeCommand("grow-image-down")
    removeCommand("grow-image-left")
    removeCommand("grow-image-right")
    removeCommand("grow-image-up")
    removeCommand("move-down")
    removeCommand("move-image-down")
    removeCommand("move-image-left")
    removeCommand("move-image-right")
    removeCommand("move-image-up")
    removeCommand("move-left")
    removeCommand("move-right")
    removeCommand("move-up")
    removeCommand("rotate-clockwise")
    removeCommand("rotate-counter-clockwise")
    removeCommand("rotate-image-clockwise")
    removeCommand("rotate-image-counter-clockwise")
    removeCommand("shrink-image-down")
    removeCommand("shrink-image-left")
    removeCommand("shrink-image-right")
    removeCommand("shrink-image-up")
    removeCommand("zoom-image-in")
    removeCommand("zoom-image-out")
    removeCommand("zoom-in")
    removeCommand("zoom-out")

    ID_MAP.forEach((key, index) => {
      removeCommand(`focus-cell-${key}`)
      removeCommand(`swap-with-cell-${key}`)
    })
  })

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

<div class={scope + " workarea"}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <section>
    <svg
      bind:this={svgElement}
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
</div>
{#if !readonly && editmode && transforms}
  <slot />
  <PhotoWheel {sources} bind:this={photoWheel} />
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
