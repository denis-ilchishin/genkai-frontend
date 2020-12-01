<template>
  <NavigationMenu
    :show="show"
    :title="$t('nav.moreTitle')"
    code="more"
    @close="$emit('close')"
  >
    <v-list color="transparent" dark>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        color="primary"
        nuxt
        exact
      >
        <v-list-item-action>
          <v-icon v-text="item.icon" />
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $helpers.c(item.text) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </NavigationMenu>
</template>

<script>
export default {
  props: { show: { type: Boolean } },
  data() {
    return {
      items: [
        {
          icon: 'fiber_new',
          text: this.$t('updates.menu'),
          to: { name: 'updates' },
        },
        {
          icon: 'folder_open',
          text: this.$t('catalog.menu'),
          to: { name: 'catalog' },
        },
        {
          icon: 'play_arrow',
          text: this.$t('ongoings.menu'),
          to: {
            name: 'catalog',
            query: {
              status: 'ongoing',
            },
          },
        },
      ],
    }
  },
}
</script>

<style></style>
