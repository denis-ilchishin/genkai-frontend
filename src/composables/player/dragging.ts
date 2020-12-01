import { ref, useContext, watch } from '@nuxtjs/composition-api'
import { useCommon } from '~/composables/common'
import { Position, useDraggable } from '~/composables/draggable'
import { usePlayerBase } from './base'

export const usePlayerDragging = () => {
  const { $auth, $settings } = useContext()
  const { isMobile, isMounted } = useCommon()
  const { isMinimized } = usePlayerBase()
  const dragArea = ref<null | HTMLElement>(null)
  const getPlayerDialog = () =>
    document?.querySelector('#player-dialog .v-dialog') as HTMLElement

  const dragOffset = 4
  const {
    isDragging,
    getTranlslatePosition,
    setPosition,
    resize,
  } = useDraggable(
    () => dragArea.value,
    getPlayerDialog,
    () => isMinimized.value,
    isMobile ? { bottom: $settings.BOTNAV_HEIGHT + dragOffset } : {},
    dragOffset,
    $auth.$storage.getLocalStorage(
      $settings.CACHE_KEYS.PLAYER_MINIMIZED_POSITION
    )
  )

  watch(isDragging, (value) => {
    if (isMounted.value) {
      if (!value) {
        $auth.$storage.setLocalStorage(
          $settings.CACHE_KEYS.PLAYER_MINIMIZED_POSITION,
          getTranlslatePosition()
        )
      }
    }
  })

  watch(isMinimized, (value) => {
    if (isMounted.value) {
      if (value) {
        const position: Position = $auth.$storage.getLocalStorage(
          $settings.CACHE_KEYS.PLAYER_MINIMIZED_POSITION
        ) ?? { x: 0, y: 0 }
        setTimeout(() => {
          setPosition(position.x, position.y)
        })
      } else {
        const playerDialog = getPlayerDialog()
        if (playerDialog) {
          playerDialog.style.transform = 'none'
        }
      }
    }
  })

  watch(isMinimized, (to) => {
    if (to) {
      window?.addEventListener('resize', resize, false)
    } else {
      window?.removeEventListener('resize', resize)
    }
  })

  return {
    isDragging,
    dragArea,
  }
}
