<template>
  <div>
    <NavigationAccountMenu
      :show="showAccountMenu"
      @close="showAccountMenu = false"
    />
    <NavigationMoreMenu :show="showMoreMenu" @close="showMoreMenu = false" />

    <v-bottom-navigation
      v-model="model"
      app
      dark
      color="primary"
      :height="$settings.BOTNAV_HEIGHT"
      grow
      background-color="secondary"
    >
      <v-btn class="d-none"></v-btn>
      <v-btn :to="{ name: 'index' }" exact class="menu-btn">
        <span class="menu-btn__text" v-text="$t('home.menu')" />
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn
        class="menu-btn"
        @click="$store.commit('SET_SHOW_SEARCH_MENU', true)"
      >
        <span class="menu-btn__text" v-text="$t('nav.search')" />
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn
        v-if="$auth.loggedIn"
        class="menu-btn"
        :class="{ 'v-btn--active': isOneOfAccountPages }"
        @click="showAccountMenu = !showAccountMenu"
      >
        <span class="menu-btn__text" v-text="$t('nav.accountTitle')" />
        <v-badge
          :content="$auth.user.notifications_count"
          :value="Boolean($auth.user.notifications_count)"
          color="primary"
          offset-x="10"
          offset-y="15"
        >
          <v-icon>person</v-icon>
        </v-badge>
      </v-btn>

      <v-btn v-else class="menu-btn" :to="{ name: 'login' }">
        <span class="menu-btn__text" v-text="$t('nav.accountTitle')" />
        <v-icon>person</v-icon>
      </v-btn>

      <v-btn
        class="menu-btn"
        :class="{ 'v-btn--active': isOneOfMorePages }"
        @click="showMoreMenu = true"
      >
        <span class="menu-btn__text" v-text="$t('nav.moreTitle')" />
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showAccountMenu: false,
      showMoreMenu: false,
      model: null,
    }
  },
  computed: {
    ...mapGetters('user', ['notificationsCount']),
    isOneOfMorePages() {
      return ['updates', 'catalog'].includes(this.$route.name)
    },
    isOneOfAccountPages() {
      return this.$route.name.startsWith('account')
    },
  },
  watch: {
    '$route.name'(to) {
      this.closeAll()
    },
    model(to, from) {
      setTimeout(() => {
        this.model = 0
      })
    },
  },
  methods: {
    closeAll() {
      this.showAccountMenu = false
      this.showMoreMenu = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';

.v-bottom-navigation {
  box-shadow: 0px -3px 4px 0px rgba(0, 0, 0, 0.14) !important;
}
.menu-btn {
  min-width: auto !important;
  padding: 0 8px !important;
  .menu-btn__text {
    text-transform: uppercase;
    font-size: 0.7rem;
  }
}
</style>
