<template>
  <v-scale-transition origin="bottom center 0" mode="out-in">
    <v-snackbar
      v-if="isDisplaying"
      :timeout="-1"
      :color="toast.options.color"
      :transition="false"
      :value="true"
      :style="{
        '--botnav-height': `${$settings.BOTNAV_HEIGHT}px`,
      }"
      :class="{ isMobile }"
    >
      <template>
        <span v-html="toast.text"></span>
      </template>
      <template v-if="toast.options.closeable" v-slot:action>
        <v-btn icon large :color="closeIconColor" @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-scale-transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      transitionTimeoutTime: 100,
      transitionTimeout: null,
      toastTimeout: null,
      isActiveQueue: false,
      closeIconColor: 'rgba(0, 0, 0, 0.3)',
      isDisplaying: false,
      toast: null,
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
    queue() {
      return this.$store.getters['toasts/queue']
    },
  },
  watch: {
    queue(to) {
      if (to.length && !to[0].options.queue) {
        if (this.transitionTimeout) clearTimeout(this.transitionTimeout)
        if (this.toastTimeout) clearTimeout(this.toastTimeout)
        this.startQueue()
      } else if (!this.isActiveQueue) {
        this.startQueue()
      }
    },
  },
  methods: {
    close() {
      this.isDisplaying = false
      this.$store.commit('toasts/CLOSE_TOAST')
      if (this.transitionTimeout) clearTimeout(this.transitionTimeout)
      if (this.toastTimeout) clearTimeout(this.toastTimeout)
      this.startQueue()
    },
    startQueue() {
      if (this.queue.length) {
        this.isActiveQueue = true
        this.isDisplaying = false

        const newToast = this.queue[0]

        this.transitionTimeout = setTimeout(() => {
          this.toast = newToast
          this.isDisplaying = true

          this.toastTimeout = setTimeout(() => {
            this.close()
          }, this.toast.options.timeout)
        }, this.transitionTimeoutTime)
      } else {
        this.isActiveQueue = false
        this.toast = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-snack::v-deep {
  padding: 0 !important;

  .v-snack__wrapper {
    min-height: 58px;
    .v-snack__content {
      align-items: center;
      align-self: center;
    }
  }
}
.is-mobile {
  .v-snack::v-deep {
    height: auto !important;
    bottom: var(--botnav-height);
  }
}
</style>
