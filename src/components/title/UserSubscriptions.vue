<template>
  <v-menu
    v-if="$auth.loggedIn"
    v-model="opened"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="player-btn mt-2 mt-md-0 ml-md-2"
        small
        color="secondary"
        v-on="on"
      >
        <v-icon left>{{ buttonIcon }}</v-icon>
        {{ buttonText }}
      </v-btn>
    </template>
    <v-list flat>
      <v-subheader>Подписка на уведомления о выходе новых серий</v-subheader>
      <v-list-item
        v-for="translator in translators"
        :key="translator.id"
        link
        :disabled="isLoading(translator.id)"
        @click="toggleSubscription(translator.id)"
      >
        <v-list-item-action>
          <v-checkbox
            :input-value="isActive(translator.id)"
            readonly
            color="primary"
          ></v-checkbox>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ translator.name }}</v-list-item-title>
        </v-list-item-content>
        <v-fade-transition>
          <v-progress-circular
            v-show="isLoading(translator.id)"
            indeterminate
            size="16"
            width="2"
          ></v-progress-circular>
        </v-fade-transition>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-btn
    v-else
    small
    color="secondary"
    class="mt-2 mt-md-0 ml-md-2"
    @click="onNotAuthClickSubscription"
  >
    <v-icon left>{{ buttonIcon }}</v-icon>
    {{ buttonText }}
  </v-btn>
</template>

<script>
export default {
  props: { title: { required: true, type: Object } },
  data() {
    return {
      opened: false,
      buttonIcon: 'subscriptions',
      buttonText: this.$t('title.translations.subscriptionButton'),
    }
  },
  computed: {
    translators() {
      const translators = []
      for (const translation of this.title.translations) {
        if (!translators.find((t) => t.id === translation.translator.id)) {
          translators.push(translation.translator)
        }
      }

      return translators
    },
  },
  watch: {
    opened(to) {
      if (to) {
        this.$sw.subscribe()
      }
    },
  },
  methods: {
    isLoading(translatorId) {
      return this.$wait.is([
        `user.addSubscription.${this.title.slug}.${translatorId}`,
        `user.deleleSubscription.${this.title.slug}.${translatorId}`,
      ])
    },
    isActive(translatorId) {
      return this.$auth.user.subscriptions.find(
        (subscription) =>
          subscription.translator.id === translatorId &&
          subscription.title.slug === this.title.slug
      )
    },
    onNotAuthClickSubscription() {
      this.$toast.error(this.$t('title.translations.authForNotification'), {
        queue: false,
      })
    },
    toggleSubscription(translatorId) {
      const subscription = this.isActive(translatorId)
      if (subscription) {
        this.$store
          .dispatch('user/deleteSubscription', {
            titleSlug: this.title.slug,
            translatorId,
            subscriptionId: subscription.id,
          })
          .catch((err) => {
            this.$pr(err)
          })
      } else {
        this.$store
          .dispatch('user/addSubscription', {
            titleSlug: this.title.slug,
            translatorId,
          })
          .catch((err) => {
            this.$pr(err)
          })
      }
    },
  },
}
</script>

<style></style>
