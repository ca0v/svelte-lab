<script lang="ts">
  const ID_MAP = {
    SHIFT: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
    ALT: "".split(""),
  }
  const ID_MAP_KEYS = [...ID_MAP.SHIFT, ...ID_MAP.ALT]

  function getHotkey(index: number) {
    const keys = ID_MAP_KEYS
    return keys[index]
  }

  import {
    deepClone,
    getEffectiveTransform,
    hasFocus,
    log,
  } from "../lib/globals"

  import PhotoWheel, { type Source } from "./PhotoWheel.svelte"
  import SvgImage from "./SvgImage.svelte"
  import type { BBox, CollageCellState, CollageData } from "../d.ts/index"
  import { toast } from "../store/toasts"
  import { hasContext, onDestroy, onMount } from "svelte"
  import { commander, contexts } from "../store/commands"
  import {
    duplicateImageClipPath,
    moveClipPath,
    type Direction,
  } from "@/lib/paths"

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

  function getPhotoWheelActiveSource() {
    return photoWheel.activeSource as Source
  }

  function copy(from: CollageCellState, into: CollageCellState) {
    into.id = from.id
    into.baseurl = from.baseurl
    into.x = from.x
    into.y = from.y
    into.width = from.width
    into.height = from.height
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
    const t1 = transforms.data?.find((i) => i.target === target1)
    if (!t1) {
      toast("no target image")
      return
    }

    const t2 = transforms.data?.find((i) => i.target === target2)
    if (!t2) {
      toast("no active image")
      return
    }

    switch (mode) {
      case "copy":
        copy(t2, t1)
        transforms = transforms
        break
      default:
        swap(t1, t2)
        transforms = transforms
    }
  }

  function focusTarget(targetName: string) {
    const target = document.querySelector(`[data-target="${targetName}"] image`)
    // @ts-ignore
    target?.focus()
    // scroll the target into view
    target?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  $: setWorkareaWidthCssVariable(width)

  let lastActiveCell: SVGImageElement
  document.addEventListener(
    "focus",
    () => {
      getActiveCell()
    },
    true
  )
  function getActiveCell() {
    const image = document.activeElement as SVGImageElement
    if (image instanceof SVGImageElement) {
      lastActiveCell = image
      return image
    }
    return null
  }

  onMount(async () => {
    function getSourceTransform() {
      const target = getFocusCellIdentifier()
      if (!target) return

      return transforms?.data?.find((d) => d.target === target)
    }

    function isDisabled(index: number): boolean {
      if (!hasFocus(svgElement)) return true
      return !isTransform(index) || getTransform(index) == getSourceTransform()
    }

    function isTransform(index: number): boolean {
      return !!transforms?.data?.[index]
    }

    function getTransform(index: number) {
      const result = transforms.data![index]
      if (!result) throw "no transform"
      return result
    }

    const keys = ID_MAP_KEYS

    keys.forEach((key, index) => {
      contexts.swap.addCommand({
        event: `swap-with-cell-${key}`,
        name: `Swap with ${key}`,
        trigger: {
          key: key.toLocaleLowerCase(),
        },
        disabled: () => isDisabled(index),
        execute: () => {
          if (!transforms.data) throw "no transforms data"
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) return
          const targetImage = transforms.data[index]
          if (!targetImage) return
          swap(targetImage, sourceTransform)
          focusTarget(targetImage.target!)
          getFocusCellIdentifier()
          transforms = transforms
          return true
        },
      })

      contexts.copy.addCommand({
        event: `copy-into-cell-${key}`,
        name: `Copy to ${key}`,
        trigger: {
          key: key.toLocaleUpperCase(),
        },
        disabled: () => isDisabled(index) && !getPhotoWheelActiveSource(),
        execute: () => {
          if (
            getSourceTransform() &&
            (hasFocus(svgElement) || !getPhotoWheelActiveSource())
          ) {
            const sourceTransform = getSourceTransform()
            if (!sourceTransform) return
            const targetImage = getTransform(index)
            copy(sourceTransform, targetImage)
            focusTarget(targetImage.target!)
            getFocusCellIdentifier()
            transforms = transforms
            return true
          } else {
            const source = getPhotoWheelActiveSource()
            if (!source) throw "no active source"
            const targetImage = getTransform(index)
            targetImage.id = source.id
            targetImage.baseurl = source.url
            transforms = transforms
            return true
          }
        },
      })

      contexts.goto.addCommand({
        event: `focus-cell-${key}`,
        name: `Goto ${key}`,
        trigger: {
          key: key.toLocaleUpperCase(),
        },
        disabled: () => !isTransform(index),
        execute: () => {
          const targetImage = getTransform(index)
          focusTarget(targetImage.target!)
          return true
        },
      })
    })

    contexts.workarea
      .addCommand({
        event: "focus-work-area",
        name: "Focus Work Area",
        trigger: {
          key: "w",
        },
        execute: () => {
          if (lastActiveCell) {
            lastActiveCell.focus()
          } else {
            focusTarget("i1")
          }
          return true
        },
      })
      .addCommand({
        event: "delete-cell",
        name: "Delete Cell",
        trigger: {
          key: "Delete",
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
      .addCommand({
        event: "swap-cell-up",
        name: "Bring To Top",
        trigger: {
          key: "Enter",
        },
        disabled: () => !getSourceTransform(),
        execute: () => {
          // need to swap the identity, as that is what determines the order on reload
          if (!transforms.data) throw "no transforms data"
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) throw "no source transform"
          const index = transforms.data.findIndex(
            (d) => d.target === sourceTransform.target
          )
          const targetTransform = transforms.data[transforms.data.length - 1]
          if (targetTransform === sourceTransform) throw "already on top"

          // place the source transform at the end of the list
          transforms.data.splice(index, 1)
          transforms.data.push(sourceTransform)

          // redraw
          transforms = transforms
          return true
        },
      })

    contexts.workarea.addCommand({
      name: "clone",
      event: "clone-cell",
      title: "Clone Current Cell",
      trigger: {
        key: "d",
      },
      execute: () => {
        // get the image that is currently focused
        if (!transforms.data) throw "no transforms data"
        const target = getFocusCellIdentifier()
        if (!target) return

        const sourceTransformIndex = transforms.data.findIndex(
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
        const currentStyle = cell.transform
          ? getEffectiveTransform(cell.transform)
          : ""
        cell.transform = `${currentStyle} rotate(${rotation}deg)`
      }

      function translate(cell: CollageCellState, x: number, y: number) {
        const currentStyle = cell.transform
          ? getEffectiveTransform(cell.transform)
          : ""
        cell.transform = `${currentStyle} translate(${x}px, ${y}px)`
      }

      function rotateImage(cell: SVGImageElement, rotation: number) {
        const currentStyle = getEffectiveTransform(cell.style.transform)
        cell.style.transform = `${currentStyle} rotate(${rotation}deg)`
      }

      function move(cell: CollageCellState, box: BBox) {
        cell.x = (cell.x || 0) + (box.x || 0)
        cell.y = (cell.y || 0) + (box.y || 0)
        cell.width = (cell.width || 0) + (box.width || 0)
        cell.height = (cell.height || 0) + (box.height || 0)
        return cell as { x: number; y: number; width: number; height: number }
      }

      function zoom(cell: CollageCellState, scale: { dx: number; dy: number }) {
        const { x: x0, y: y0, width: w0, height: h0 } = move(cell, {})
        const { dx, dy } = scale
        const dw = w0 * (dx / x0)
        const dh = h0 * (dy / y0)
        move(cell, { x: dx, y: dy, width: dw, height: dh })
      }

      function createEdgeMover(direction: Direction) {
        return () => {
          const sourceTransform = getSourceTransform()
          if (!sourceTransform) throw "no source transform"
          // move the actual clippath points
          const image = getActiveCell()
          if (!image) throw "no active cell"
          const clipPath = duplicateImageClipPath(
            image,
            `${transforms.id}-${sourceTransform.target}`
          )
          moveClipPath(clipPath, direction)
          sourceTransform.clipPath = clipPath.id.substring(5) // remove clip_
        }
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

            const w0 = sourceTransform.width || 0
            const h0 = sourceTransform.height || 0

            const currentStyle = getEffectiveTransform(
              sourceTransform.transform || ""
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

      contexts.navigation.upActions
        .addCommand({
          event: "move-top-edge-up",
          name: "Move Top Edge Up",
          trigger: {
            key: "ArrowUp",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ top: -1 }),
        })
        .addCommand({
          event: "move-top-edge-down",
          name: "Move Top Edge Down",
          trigger: {
            key: "ArrowDown",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ top: 1 }),
        })

      contexts.navigation.downActions
        .addCommand({
          event: "move-bottom-edge-up",
          name: "Move Bottom Edge Up",
          trigger: {
            key: "ArrowUp",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ bottom: -1 }),
        })
        .addCommand({
          event: "move-bottom-edge-down",
          name: "Move Bottom Edge Down",
          trigger: {
            key: "ArrowDown",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ bottom: 1 }),
        })

      contexts.navigation.leftActions
        .addCommand({
          event: "move-left-edge-left",
          name: "Move Left Edge Left",
          trigger: {
            key: "ArrowLeft",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ left: -1 }),
        })
        .addCommand({
          event: "move-left-edge-right",
          name: "Move Left Edge Right",
          trigger: {
            key: "ArrowRight",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ left: 1 }),
        })

      contexts.navigation.rightActions
        .addCommand({
          event: "move-right-edge-left",
          name: "Move Right Edge Left",
          trigger: {
            key: "ArrowLeft",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ right: -1 }),
        })
        .addCommand({
          event: "move-right-edge-right",
          name: "Move Right Edge Right",
          trigger: {
            key: "ArrowRight",
          },
          disabled: () => !getSourceTransform(),
          execute: createEdgeMover({ right: 1 }),
        })

      contexts.navigation.zoomActions
        .addCommand({
          event: "zoom-image-in",
          name: "Zoom Image In",
          trigger: {
            key: "ArrowUp",
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
        .addCommand({
          event: "zoom-image-out",
          name: "Zoom Image Out",
          trigger: {
            key: "ArrowDown",
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
        .addCommand({
          event: "zoom-in",
          name: "Zoom In",
          trigger: {
            key: "ArrowUp",
            isShift: true,
          },
          disabled: () => !getSourceTransform(),
          execute: createMoveHandler({ width: 1, height: 1 }),
        })
        .addCommand({
          event: "zoom-out",
          name: "Zoom Out",
          trigger: {
            key: "ArrowDown",
            isShift: true,
          },
          disabled: () => !getSourceTransform(),
          execute: createMoveHandler({ width: -1, height: -1 }),
        })

      contexts.navigation.moveActions
        .addCommand({
          event: "move-up",
          name: "Move Up",
          trigger: {
            key: "ArrowUp",
            isShift: true,
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
        .addCommand({
          event: "move-down",
          name: "Move Down",
          trigger: {
            key: "ArrowDown",
            isShift: true,
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
        .addCommand({
          event: "move-left",
          name: "Move Left",
          trigger: {
            key: "ArrowLeft",
            isShift: true,
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
        .addCommand({
          event: "move-right",
          name: "Move Right",
          trigger: {
            key: "ArrowRight",
            isShift: true,
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
        .addCommand({
          event: "move-image-up",
          name: "Move Image Up",
          trigger: {
            key: "ArrowUp",
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
        .addCommand({
          event: "move-image-down",
          name: "Move Image Down",
          trigger: {
            key: "ArrowDown",
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
        .addCommand({
          event: "move-image-left",
          name: "Move Image Left",
          trigger: {
            key: "ArrowLeft",
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
        .addCommand({
          event: "move-image-right",
          name: "Move Image Right",
          trigger: {
            key: "ArrowRight",
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

      contexts.rotationActions
        .addCommand({
          name: "Rotate Clockwise",
          event: "rotate-clockwise",
          trigger: {
            key: "ArrowRight",
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
        .addCommand({
          name: "Rotate Counter-Clockwise",
          event: "rotate-counter-clockwise",
          trigger: {
            key: "ArrowLeft",
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
        .addCommand({
          name: "Rotate Image Clockwise",
          event: "rotate-image-clockwise",
          trigger: {
            key: "ArrowRight",
            isShift: true,
          },
          disabled: () => !hasFocus(svgElement),
          execute: () => {
            const target = getActiveCell()
            if (!target) return
            const rotation = 6
            rotateImage(target, rotation)
            transforms = transforms
            return true
          },
        })
        .addCommand({
          name: "Rotate Image Counter-Clockwise",
          event: "rotate-image-counter-clockwise",
          trigger: {
            key: "ArrowLeft",
            isShift: true,
          },
          disabled: () => !hasFocus(svgElement),
          execute: () => {
            const target = getActiveCell()
            if (!target) return
            const rotation = -6
            rotateImage(target, rotation)
            transforms = transforms
            return true
          },
        })
    }
  })

  onDestroy(() => {})

  function getFocusCellIdentifier() {
    const image = getActiveCell()
    if (!image) return
    const target = image.parentElement?.dataset.target
    return target
  }
</script>

<div class={scope + " workarea"}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <section>
    {#if !transforms?.data}
      <button on:click={() => commander.play("search-commands")}
        >No layout defined, select one</button
      >
    {:else}
      <svg
        bind:this={svgElement}
        class:border={editmode}
        viewBox="-100 -100 200 200"
        stroke-width="0"
        fill="#000"
      >
        {#each transforms.data as transform, i}
          <b>i</b>
          <SvgImage
            {editmode}
            {readonly}
            fast={editmode}
            href={transform.baseurl}
            clipPath={transform.clipPath || ""}
            x={transform.x || 0}
            y={transform.y || 0}
            width={transform.width || 0}
            height={transform.height || 0}
            on:swap={swapHandler}
            on:drop={(e) => {
              const { id, url } = e.detail
              transform.id = id
              transform.baseurl = url
              transforms = transforms
            }}
            target={`${transform.target}`}
            hotkey={getHotkey(i)}
            style={transform.transform || ""}
            background={{
              stroke: transform.background?.stroke || "none",
              fill: transform.background?.fill || "none",
            }}
          />
        {/each}
      </svg>
    {/if}
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

  svg.border:has(*:focus) {
    outline: 1px solid var(--color-border-focus);
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
