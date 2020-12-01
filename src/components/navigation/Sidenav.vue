<template>
  <div>
    <v-overlay id="sidenav-overlay" :value="isHovered" />
    <v-navigation-drawer
      id="sidenav"
      ref="sidenav"
      :value="true"
      :width="
        isHovered ? $settings.SIDENAV_WIDTH : $settings.SIDENAV_MINI_WIDTH
      "
      :temporary="false"
      app
      dark
      stateless
      color="secondary"
      @mouseenter.native="isHovered = true"
      @mouseleave.native="isHovered = false"
    >
      <v-list class="pt-0">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          nuxt
          :exact="item.to.name === 'index'"
          color="primary"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item @click="openSearchMenu()">
          <v-list-item-action>
            <v-icon>search</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="$t('nav.search')" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="$auth.loggedIn">
        <v-list-item
          v-for="(item, i) in $settings.ACCOUNT_NAV_LIST"
          :key="i"
          :to="item.route"
          nuxt
          color="primary"
        >
          <v-list-item-action>
            <v-badge
              v-if="item.route.name == 'account-notifications'"
              :content="$auth.user.notifications_count"
              :value="$auth.user.notifications_count"
              color="primary"
              absolute
              overlap
              class="mt-0"
            >
              <v-icon v-text="item.icon" />
            </v-badge>

            <v-icon v-else v-text="item.icon" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $helpers.c($t(item.text)) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="$auth.logout()">
          <v-list-item-action>
            <v-icon>logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $helpers.c($t('nav.logout')) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-else>
        <v-list-item :to="{ name: 'login' }" nuxt>
          <v-list-item-action>
            <v-icon>person</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title v-text="$t('nav.login')" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import {
  defineComponent,
  ref,
  watch,
  computed,
  onMounted,
  useContext,
  getCurrentInstance,
} from '@nuxtjs/composition-api'
import { useSearchMenu } from '~/mixins/SearchMenu'
import { Location } from 'vue-router'

export default defineComponent({
  setup() {
    const vm = getCurrentInstance()
    const { store } = useContext()
    const { openSearchMenu } = useSearchMenu()
    const isHovered = ref(false)
    const isMini = ref(true)

    const items: { icon: string; title: string; to: Location }[] = [
      {
        icon: 'home',
        title: vm?.$t('home.menu') as string,
        to: { name: 'index' },
      },
      {
        icon: 'fiber_new',
        title: vm?.$t('updates.menu') as string,
        to: { name: 'updates' },
      },
      {
        icon: 'folder_open',
        title: vm?.$t('catalog.menu') as string,
        to: { name: 'catalog' },
      },
      {
        icon: 'play_arrow',
        title: vm?.$t('ongoings.menu') as string,
        to: {
          name: 'catalog',
          query: {
            status: 'ongoing',
          },
        },
      },
    ]

    watch(isHovered, (hovered) => {
      if (process.client && document) {
        const html = document.querySelector('html')
        const application = document.querySelector('#application')

        if (html instanceof HTMLElement && application instanceof HTMLElement) {
          const scrollbarWidth = window.innerWidth - html.offsetWidth
          application.style.paddingRight = hovered
            ? `${scrollbarWidth}px`
            : '0px'
          html.style.overflow = hovered ? 'hidden' : 'initial'
        }
      }
    })

    return {
      isHovered,
      isMini,
      items,
      openSearchMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
#sidenav {
  backdrop-filter: blur(5px);
}
#sidenav-overlay.v-overlay--active {
  // backdrop-filter: blur(1px);
}
</style>
