<template>
  <v-app id="application" :class="{ 'is-mobile': isMobile }">
    <NavigationSidenav v-if="!isMobile" ref="sidenav" />
    <v-app-bar
      id="appbar"
      :app="!isMobile"
      dark
      dense
      flat
      elevation="3"
      :style="appbarStyles"
      color="secondary"
    >
      <v-container class="pa-0 d-flex flex-row flex-grow-1">
        <v-img
          class="logo"
          :alt="$t('topbar.logo.alt')"
          :title="$t('topbar.logo.title')"
          :src="topBarLogo"
          :max-width="topBarLogoSize"
          contain
        ></v-img>
      </v-container>
    </v-app-bar>
    <v-main :style="mainStyles">
      <nuxt />
    </v-main>
    <NavigationSearchMenu />
    <NavigationBotnav v-if="isMobile" />
    <Toast />
    <TitlePlayer />
  </v-app>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import {
  defineComponent,
  ref,
  computed,
  useContext,
  watch,
  getCurrentInstance,
  onMounted,
} from '@nuxtjs/composition-api'

import { useSearchMenu } from '~/mixins/SearchMenu'
import { ObjectType } from '~/types/core'

export default defineComponent({
  name: 'DefaultLayout',
  setup(props, { root: { $route } }) {
    const { store, $auth, $toast, $settings, $isDev } = useContext()
    const { closeSearchMenu } = useSearchMenu()
    const vm = getCurrentInstance()

    const isMobile = store.getters.isMobile

    const sidenav = ref(null)

    // Watch user login state
    watch(
      () => $auth.loggedIn,
      (loggedIn: boolean) => {
        if (!loggedIn) {
          $toast.default(vm?.$t('logout.success') as string)
        }
      }
    )

    // Close seatch menu on route change
    watch(
      () => $route,
      (route) => {
        closeSearchMenu()
      }
    )

    const mainStyles: ObjectType = {}
    const appbarStyles: ObjectType = {}

    if (!isMobile) {
      mainStyles.paddingLeft = `${$settings.SIDENAV_MINI_WIDTH}px`
      appbarStyles.left = `${$settings.SIDENAV_MINI_WIDTH}px`
    }

    onMounted(() => {
      if ($isDev) {
        console.log(getCurrentInstance())
      }
    })

    return {
      isMobile,
      topBarLogoSize: 120,
      topBarLogo: '/logo.png',
      mainStyles,
      appbarStyles,
      sidenav,
      closeSearchMenu,
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/main';
#appbar {
  z-index: 3;
  flex: 0 1 auto;
}

#progress {
  z-index: 203;
}
</style>
