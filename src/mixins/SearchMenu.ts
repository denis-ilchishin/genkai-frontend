import { computed, useContext } from '@nuxtjs/composition-api'

export const useSearchMenu = () => {
  const { store } = useContext()

  const setSearchMenuState = (value: boolean) => {
    store.commit('SET_SHOW_SEARCH_MENU', value)
  }

  const openSearchMenu = () => {
    setSearchMenuState(true)
  }

  const closeSearchMenu = () => {
    setSearchMenuState(false)
  }

  const isShowingSearchMenu = computed(() => store.getters.showSearchMenu)

  return {
    openSearchMenu,
    closeSearchMenu,
    isShowingSearchMenu,
  }
}
