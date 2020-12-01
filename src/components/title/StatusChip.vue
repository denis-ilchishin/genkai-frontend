<template>
  <v-chip
    class="text-uppercase lh-0"
    :color="$settings.TITLE_STATUS_COLORS[title.status]"
    dark
    label
    :small="small"
    :x-small="xSmall"
    :style="{ 'line-height': xSmall ? '1px !important' : '' }"
    >{{ statuses[title.status] }}</v-chip
  >
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    title: { type: Object, required: true },
    small: { type: Boolean, default: false },
    xSmall: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters('config', ['statuses']),
  },
}
</script>

<style></style>
