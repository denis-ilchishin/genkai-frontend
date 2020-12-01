<template>
  <v-container>
    <v-card flat color="transparent">
      <LazyAccountCardTitle>
        {{ $helpers.c($t('account.lists.title')) }}
      </LazyAccountCardTitle>
      <LazyAccountListsMobile v-if="isMobile" />
      <LazyAccountListsDesktop v-else />
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: ['user'],
  data() {
    return {
      isMobile: this.$store.getters.isMobile,
    }
  },
  head() {
    return {
      title: this.$t('meta.accountLists.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.accountLists.metas.description'),
        },
        {
          name: 'robots',
          vmid: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
}
</script>
