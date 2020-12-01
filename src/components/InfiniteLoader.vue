<template>
  <div class="d-flex justify-center align-items-center pa-2">
    <v-expand-transition mode="out-in">
      <infinite-loading
        v-if="!isLoading"
        :identifier="identifier"
        class="_inf"
        @infinite="$emit('infinite')"
      >
        <template v-slot:spinner><span /></template>
      </infinite-loading>
      <v-progress-circular v-else indeterminate color="primary" />
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import InfiniteLoading from 'vue-infinite-loading'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  components: {
    InfiniteLoading,
  },
  props: {
    identifier: {
      type: [String, Number],
      default: new Date().getTime(),
    },
    isLoading: {
      type: Boolean,
    },
  },
})
</script>

<style></style>

<style lang="scss" scoped>
._inf::v-deep {
  height: 1px;
  width: 1px;
}
</style>
