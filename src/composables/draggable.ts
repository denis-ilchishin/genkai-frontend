import { onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'

type Target = () => HTMLElement | null | undefined
export type Position = { x: number; y: number }

export const useDraggable = (
  getDragTarget: Target,
  getTranslateTarget: Target,
  isEnabled: () => boolean,
  desiredOffset: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  } = {},
  baseOffset?: number,
  initialPosition?: Position
) => {
  const isDragging = ref<boolean>(false)

  const minimalOffset = baseOffset ?? 4

  const getOffset = () => ({
    left: desiredOffset.left ?? minimalOffset,
    right: desiredOffset.right ?? minimalOffset,
    top: desiredOffset.top ?? minimalOffset,
    bottom: desiredOffset.bottom ?? minimalOffset,
  })

  const initialX = ref<number>(0)
  const initialY = ref<number>(0)

  const currentX = ref<number>(0)
  const currentY = ref<number>(0)

  const offsetX = ref<number>(0)
  const offsetY = ref<number>(0)

  const setTransform = (el: HTMLElement, x: number, y: number) => {
    el.style.transform = getTranlslate(x, y)
  }

  const setInitialPosition = () => {
    const target = getTranslateTarget()
    if (target) {
      offsetX.value = getXPos(target, initialPosition?.x ?? minimalOffset)
      offsetY.value = getYPos(target, initialPosition?.y ?? minimalOffset)
    }
  }

  const body = () => document?.body

  const getXPos = (target: HTMLElement, value: number) => {
    return Math.min(
      Math.max(value, getOffset().right),
      window.innerWidth - target.offsetWidth - getOffset().left
    )
  }

  const getYPos = (target: HTMLElement, value: number) => {
    return Math.min(
      Math.max(value, getOffset().top),
      window.innerHeight - target.offsetHeight - getOffset().bottom
    )
  }

  const setPosition = (x: number, y: number) => {
    const target = getTranslateTarget()
    if (target) {
      currentX.value = getXPos(target, x)
      currentY.value = getYPos(target, y)

      offsetX.value = currentX.value
      offsetY.value = currentY.value

      setTransform(target, currentX.value, currentY.value)
    }
  }

  const onDrag = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (e.type === 'touchmove') {
      setPosition(
        // @ts-ignore
        e.touches[0].clientX - initialX.value,
        // @ts-ignore
        e.touches[0].clientY - initialY.value
      )
    } else {
      setPosition(
        // @ts-ignore
        e.clientX - initialX.value,
        // @ts-ignore
        e.clientY - initialY.value
      )
    }
  }

  const onDragStart = (e: MouseEvent | TouchEvent) => {
    if (e.target === getDragTarget() && isEnabled()) {
      if (e.type === 'touchstart') {
        // @ts-ignore
        initialX.value = e.touches[0].clientX - offsetX.value
        // @ts-ignore
        initialY.value = e.touches[0].clientY - offsetY.value
      } else {
        // @ts-ignore
        initialX.value = e.clientX - offsetX.value
        // @ts-ignore
        initialY.value = e.clientY - offsetY.value
      }
      isDragging.value = true
      body()?.addEventListener('mousemove', onDrag, false)
      body()?.addEventListener('touchmove', onDrag, { passive: false })
    }
  }

  const onDragEnd = (e: MouseEvent | TouchEvent) => {
    isDragging.value = false
    initialX.value = currentX.value
    initialY.value = currentY.value
    body()?.removeEventListener('mousemove', onDrag)
    body()?.removeEventListener('touchmove', onDrag)
  }

  const getTranlslate = (x: number, y: number) =>
    `translate3d(${x}px, ${y}px, 0)`

  const getTranlslatePosition = () =>
    ({ x: currentX.value, y: currentY.value } as Position)

  const resize = () => {
    setPosition(currentX.value, currentY.value)
  }

  onMounted(() => {
    setInitialPosition()
    body()?.addEventListener('mousedown', onDragStart, false)
    body()?.addEventListener('mouseup', onDragEnd, false)
    body()?.addEventListener('touchstart', onDragStart, false)
    body()?.addEventListener('touchend', onDragEnd, false)
  })

  onUnmounted(() => {
    body()?.removeEventListener('mousedown', onDragStart)
    body()?.removeEventListener('mouseup', onDragEnd)
    body()?.removeEventListener('mousemove', onDrag)
    body()?.removeEventListener('touchstart', onDragStart)
    body()?.removeEventListener('touchend', onDragEnd)
    body()?.removeEventListener('touchmove', onDrag)
  })

  return {
    isDragging,
    onDrag,
    onDragStart,
    onDragEnd,
    getTranlslate,
    getTranlslatePosition,
    setPosition,
    resize,
  }
}
