<template>
  <NavigationMenu
    :show="show"
    :title="$t('nav.accountTitle')"
    code="account"
    @close="close"
  >
    <v-list color="transparent" dark>
      <v-list-item
        v-for="(item, i) in $settings.ACCOUNT_NAV_LIST"
        :key="i"
        :to="item.route"
        color="primary"
        exact
        nuxt
      >
        <v-list-item-action>
          <v-badge
            v-if="$auth.loggedIn && item.route.name == 'account-notifications'"
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
          <v-list-item-title>{{ $helpers.c($t(item.text)) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="logout()">
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
  </NavigationMenu>
</template>

<script>
export default {
  props: { show: { type: Boolean } },
  methods: {
    close() {
      this.$emit('close')
    },
    logout() {
      this.$auth.logout()
      this.close()
    },
  },
}
</script>
