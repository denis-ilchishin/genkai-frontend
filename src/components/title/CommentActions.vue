<template>
  <span
    class="d-flex justify-space-between justify-sm-start align-center align-items-center"
  >
    <span>
      <span>
        <v-btn
          icon
          small
          :loading="$wait.is(`${waiter}${like}`)"
          :disabled="isOwner || $wait.is(`${waiter}${dislike}`)"
          :color="isRated('like') ? 'green' : ''"
          @click="$emit('ratecomment', like)"
        >
          <v-icon small class="comment-rate">thumb_up</v-icon>
        </v-btn>
        {{ comment.likes }}
      </span>
      <span class="ml-2">
        <v-btn
          icon
          small
          :loading="$wait.is(`${waiter}${dislike}`)"
          :disabled="isOwner || $wait.is(`${waiter}${like}`)"
          :color="isRated('dislike') ? 'error' : ''"
          @click="$emit('ratecomment', dislike)"
        >
          <v-icon small class="comment-rate">thumb_down</v-icon>
        </v-btn>
        {{ comment.dislikes }}
      </span>
    </span>
    <v-btn
      v-if="!isOwner"
      text
      x-small
      class="ml-sm-2 text--secondary"
      @click="$emit('reply', comment)"
    >
      {{ $helpers.c($t('comments.reply')) }}
    </v-btn>
  </span>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
    waiter: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      dislike: this.$settings.COMMENT_RATES.DISLIKE,
      like: this.$settings.COMMENT_RATES.LIKE,
    }
  },
  methods: {
    isRated(rate) {
      return this.comment.rate && this.comment.rate.rate === this[rate]
    },
  },
}
</script>

<style></style>
