<template>
  <v-container>
    <v-flex md10 offset-md1>
      <v-card color="transparent" flat>
        <v-fade-transition mode="out-in">
          <LazyAccountCardTitle v-if="!selected.length">
            {{ $helpers.c($t('account.notifications.title')) }}
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-btn icon absolute :style="{ right: '0px' }" v-on="on">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    :disabled="$wait.is(waiter.seenAll)"
                    @click="setAllAsSeen"
                  >
                    <v-list-item-icon>
                      <v-icon>visibility_off</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $helpers.c($t('account.notifications.seenAll')) }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-fade-transition>
                      <v-progress-circular
                        v-show="$wait.is(waiter.seenAll)"
                        indeterminate
                        size="16"
                        width="2"
                        class="ml-2"
                      />
                    </v-fade-transition>
                  </v-list-item>
                  <v-list-item
                    :disabled="$wait.is(waiter.deleteAll)"
                    @click="deleteAll"
                  >
                    <v-list-item-icon>
                      <v-icon>delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $helpers.c($t('account.notifications.deleteAll')) }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-fade-transition>
                      <v-progress-circular
                        v-show="$wait.is(waiter.deleteAll)"
                        indeterminate
                        size="16"
                        width="2"
                        class="ml-2"
                      />
                    </v-fade-transition>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </LazyAccountCardTitle>
          <v-card-title
            v-else
            class="notification-mobile-toolbar align-center align-self-center"
          >
            <v-btn icon @click="resetSelected">
              <v-icon>close</v-icon>
            </v-btn>
            <div class="ml-4 number">{{ selected.length }}</div>
            <v-spacer></v-spacer>
            <div class="d-flex justify-end align-center align-self-center">
              <v-btn
                icon
                :disabled="$wait.is(waiter.seenSelected)"
                :loading="$wait.is(waiter.deleteSelected)"
                @click="deleteSelected"
              >
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn
                icon
                :disabled="$wait.is(waiter.deleteSelected)"
                :loading="$wait.is(waiter.seenSelected)"
                @click="seenSelected"
              >
                <v-icon>visibility_off</v-icon>
              </v-btn>
            </div>
          </v-card-title>
        </v-fade-transition>

        <template v-if="isMobile">
          <v-list color="transparent" three-line>
            <v-fade-transition group>
              <v-list-item
                v-for="notification in notifications"
                :key="notification.id"
                v-longpress="{ timeout: 400 }"
                :input-value="isSelected(notification)"
                color="primary"
                class="notification-mobile rounded"
                link
                @longpress="toggleSelect($event, notification)"
                @click="$router.push(getRoute(notification))"
              >
                <ListItemImage>
                  <BaseImage
                    :image-set="notification.related.title.poster"
                    :image-size="imageSize"
                    :title="notification.related.title.name"
                    :alt="notification.related.title.name"
                    :height="40"
                    class="rounded-sm"
                  />
                </ListItemImage>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    <div :class="getColor(notification)">
                      <v-chip
                        x-small
                        :color="notification.seen ? '' : 'primary'"
                      >
                        {{ $helpers.c(notificationTypes[notification.type]) }}
                      </v-chip>
                      <v-icon :style="{ 'font-size': '6px' }" class="pl-2 pr-1">
                        fiber_manual_record
                      </v-icon>
                      <span class="date">
                        {{ $d(new Date(notification.date_created), 'dayTime') }}
                      </span>
                    </div>
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    {{ notification.related.title.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ getNotificationSubscriptionText(notification) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-fade-transition>
          </v-list>
        </template>
        <template v-else>
          <v-fade-transition group>
            <v-card
              v-for="notification in notifications"
              :key="notification.id"
              color="transparent"
              flat
              tile
              class="notification"
            >
              <v-card-subtitle
                class="pa-0 pb-1 px-xs-0 d-flex justify-space-between align-center align-items-center"
              >
                <div :class="getColor(notification)">
                  <v-chip x-small :color="notification.seen ? '' : 'primary'">
                    {{ $helpers.c(notificationTypes[notification.type]) }}
                  </v-chip>
                  <v-icon :style="{ 'font-size': '6px' }" class="pl-2 pr-1">
                    fiber_manual_record
                  </v-icon>
                  <span class="date">
                    {{ $d(new Date(notification.date_created), 'dayTime') }}
                  </span>
                </div>
                <div>
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        small
                        :loading="isWaiting(notification)"
                        v-on="on"
                      >
                        <v-icon>more_horiz</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item
                        v-if="!notification.seen"
                        :disabled="isWaitingSeen(notification)"
                        @click="setNotificationAsSeen(notification)"
                      >
                        <v-list-item-icon>
                          <v-icon>visibility_off</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ $helpers.c($t('account.notifications.seen')) }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-fade-transition>
                          <v-progress-circular
                            v-show="isWaitingSeen(notification)"
                            indeterminate
                            size="16"
                            width="2"
                            class="ml-2"
                          />
                        </v-fade-transition>
                      </v-list-item>
                      <v-list-item
                        :disabled="isWaitingDeleting(notification)"
                        @click="deleteNotification(notification)"
                      >
                        <v-list-item-icon>
                          <v-icon>delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ $helpers.c($t('account.notifications.delete')) }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-fade-transition>
                          <v-progress-circular
                            v-show="isWaitingDeleting(notification)"
                            indeterminate
                            size="16"
                            width="2"
                            class="ml-2"
                          />
                        </v-fade-transition>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-card-subtitle>
              <router-link
                v-ripple
                class="px-3 px-xs-0 d-flex notification-content align-items-center align-center"
                tag="div"
                :to="getRoute(notification)"
              >
                <div>
                  <BaseImage
                    :image-set="notification.related.title.poster"
                    :image-size="imageSize"
                    :title="notification.related.title.name"
                    :alt="notification.related.title.name"
                    :height="50"
                    class="rounded-sm"
                  />
                </div>
                <div class="notification-caption">
                  <v-card-title
                    class="notification-title"
                    :class="getColor(notification)"
                    >{{ notification.related.title.name }}</v-card-title
                  >
                  <v-card-subtitle
                    class="notification-subtitle"
                    :class="getColor(notification)"
                  >
                    {{ getNotificationSubscriptionText(notification) }}
                  </v-card-subtitle>
                </div>
              </router-link>
            </v-card>
          </v-fade-transition>
        </template>

        <p v-if="loaded && !notifications.length" class="text-center">
          {{ $t('account.notifications.noRecords') }}
        </p>
        <client-only>
          <LazyInfiniteLoader
            v-if="hasMore"
            :identifier="notifications.length"
            @infinite="fetchNotifications"
          />
        </client-only>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { EImageSize } from '~/types/core'
export default {
  name: 'AccountNotifications',
  middleware: ['user'],

  data() {
    return {
      imageSize: EImageSize.SMALL,
      waiter: {
        delete: 'notifications.delete.',
        deleteSelected: 'notifications.deleteSelected',
        deleteAll: 'notifications.deleteAll',
        seen: 'notifications.seen.',
        seenSelected: 'notifications.seenSelected',
        seenAll: 'notifications.seenAll',
        fetching: 'notifications.fetching',
      },
      maxSelectedNumber: this.$store.getters['config/input'](
        'account.notifications.max_selected',
        20
      ),
      loaded: false,
      notifications: [],
      next: null,
      selected: [],
    }
  },
  computed: {
    ...mapGetters('config', ['notificationTypes']),
    ...mapGetters(['isMobile']),
    hasMore() {
      return !this.loaded || (this.loaded && this.next)
    },
  },
  methods: {
    isSelected(notification) {
      return this.selected.find((n) => n === notification.id)
    },
    selectedIndex(notification) {
      const index = this.selected.findIndex((n) => n === notification.id)
      return index !== -1 ? index : null
    },
    onLongpress(notification) {
      return this.toggleSelect.bind(this, notification)
    },
    toggleSelect(event, notification) {
      event.target.blur()
      this.$vibrate('tap')

      const selectedArrayIndex = this.selectedIndex(notification)

      if (selectedArrayIndex !== null) {
        this.selected.splice(selectedArrayIndex, 1)
      } else if (this.selected.length < this.maxSelectedNumber) {
        this.selected.push(notification.id)
      } else {
        this.$toast.default(
          this.$t('account.notifications.maxSelectedExceed'),
          { queue: false }
        )
      }
    },
    resetSelected() {
      this.selected = []
    },
    getRoute(notification) {
      return {
        name: 'title-slug',
        params: {
          slug: notification.related.title.slug,
          episode: notification.related.id,
        },
      }
    },
    getColor(notification) {
      return notification.seen ? 'text--secondary' : 'text--primary'
    },
    fetchNotifications() {
      if (this.hasMore) {
        this.$wait.start(this.waiter.fetching)
        this.$axios
          .$get(this.next || 'notifications/', { progress: false })
          .then(({ results, next }) => {
            this.notifications.push(...results)
            this.next = next
            this.loaded = true
          })
          .finally(() => {
            this.$wait.end(this.waiter.fetching)
          })
      }
    },
    getNotificationSubscriptionText(notification) {
      return this.$t('account.notifications.subscriptionText', {
        translator: notification.related.translator.name,
        episode: notification.related.episode,
      })
    },
    isWaitingDeleting(notification) {
      return this.$wait.is(this.waiter.delete + notification.id)
    },
    isWaitingSeen(notification) {
      return this.$wait.is(this.waiter.seen + notification.id)
    },
    isWaiting(notification) {
      return this.$wait.is([
        this.waiter.delete + notification.id,
        this.waiter.seen + notification.id,
      ])
    },
    setNotificationAsSeen(notification) {
      /* eslint camelcase: off */
      this.$wait.start(this.waiter.seen + notification.id)
      this.$axios
        .$post(`notifications/seen/${notification.id}/`, null, {
          progress: false,
        })
        .then(({ notifications_count }) => {
          notification.seen = true

          this.$store.commit(
            'user/SET_NOTIFICATIONS_COUNT',
            notifications_count
          )
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.$wait.end(this.waiter.seen + notification.id)
          }, 100)
        })
    },
    deleteNotification(notification) {
      /* eslint camelcase: off */
      this.$wait.start(this.waiter.delete + notification.id)
      this.$axios
        .$delete(`notifications/delete/${notification.id}/`, {
          progress: false,
        })
        .then(({ notifications_count }) => {
          const index = this.notifications.findIndex(
            (n) => n.id === notification.id
          )
          if (index !== -1) {
            this.notifications.splice(index, 1)
          }
          this.$store.commit(
            'user/SET_NOTIFICATIONS_COUNT',
            notifications_count
          )
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.$wait.end(this.waiter.delete + notification.id)
          }, 100)
        })
    },
    setAllAsSeen() {
      /* eslint camelcase: off */
      this.$wait.start(this.waiter.seenAll)
      this.$axios
        .$post(`notifications/seen/all/`, null, { progress: false })
        .then(() => {
          for (const notification of this.notifications) {
            notification.seen = true
          }

          this.$store.commit('user/SET_NOTIFICATIONS_COUNT', 0)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.$wait.end(this.waiter.seenAll)
          }, 100)
        })
    },
    deleteAll() {
      /* eslint camelcase: off */
      this.$wait.start(this.waiter.deleteAll)
      this.$axios
        .$delete(`notifications/delete/all/`, { progress: false })
        .then(() => {
          this.notifications = []
          this.loaded = true
          this.next = null
          this.$store.commit('user/SET_NOTIFICATIONS_COUNT', 0)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.$wait.end(this.waiter.deleteAll)
          }, 100)
        })
    },
    deleteSelected() {
      /* eslint camelcase: off */
      this.$wait.start(this.waiter.deleteSelected)
      this.$axios
        .$post(
          `notifications/delete/selected/`,
          { ids: this.selected },
          { progress: false }
        )
        .then(({ deleted, notifications_count }) => {
          for (const id of deleted) {
            const index = this.notifications.findIndex((n) => n.id === id)
            if (index !== -1) {
              this.notifications.splice(index, 1)
            }
          }
          this.resetSelected()
          this.$store.commit(
            'user/SET_NOTIFICATIONS_COUNT',
            notifications_count
          )
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.$wait.end(this.waiter.deleteSelected)
          }, 100)
        })
    },
    seenSelected() {
      /* eslint camelcase: off */
      this.$wait.start(this.waiter.seenSelected)
      this.$axios
        .$post(
          `notifications/seen/selected/`,
          { ids: this.selected },
          { progress: false }
        )
        .then(({ seen, notifications_count }) => {
          for (const id of seen) {
            const index = this.notifications.findIndex((n) => n.id === id)
            if (index !== -1) {
              this.notifications[index].seen = true
            }
          }
          this.resetSelected()
          this.$store.commit(
            'user/SET_NOTIFICATIONS_COUNT',
            notifications_count
          )
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.$wait.end(this.waiter.seenSelected)
          }, 100)
        })
    },
  },
  head() {
    return {
      title: this.$t('meta.accountNotifications.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.accountNotifications.metas.description'),
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

<style lang="scss" scoped>
.notification {
  overflow-x: hidden;
  padding: 16px 0;

  .notification-content {
    cursor: pointer;
    .notification-caption {
      overflow-x: hidden;

      .notification-title {
        display: inherit;
        font-size: 18px;
        flex: 1 1 100%;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        margin: 0 0 0 16px;
        padding: 0px;
      }

      .notification-subtitle {
        flex: 1 1 100%;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        margin: 0 0 0 16px;
        padding: 0px;
      }
    }
  }
}
.v-toolbar__content {
  width: 100%;
}

.notification-mobile {
  $padding: 8px;

  min-height: 72px !important;
  margin-bottom: $padding !important;
  margin-top: $padding !important;

  padding-left: 0 !important;
  padding-right: 0 !important;

  .v-list-item__avatar {
    margin-left: ($padding/2) !important;
    margin-top: $padding + ($padding/2) !important;
    margin-right: $padding !important;
    margin-bottom: $padding !important;
    height: auto !important;
    min-width: auto !important;
    width: auto !important;
  }

  .v-list-item__content {
    padding-bottom: $padding !important;
    padding-top: $padding !important;
  }

  &.v-list-item--link:before {
    border-radius: inherit;
  }
}
.notification-wrapper {
  &:first-child {
    .notification {
      padding-top: 0;
    }
  }
  &:last-child {
    .notification {
      padding-bottom: 0;
    }
  }
}
</style>
