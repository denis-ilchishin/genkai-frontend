<template>
  <div class="my-4">
    <div class="d-flex flex-row" :class="{ owner: isOwner }">
      <div class="d-flex align-items-center d-sm-block pa-2 my-auto my-sm-0">
        <BaseImage
          :image-size="imageSize"
          :image-set="comment.user.profile.image"
          :height="imageHeight"
          :alt="comment.user.username"
          :title="comment.user.username"
          :poster="false"
          class="rounded-sm"
        />
      </div>
      <div class="d-flex flex-column flex-grow-1 pl-0 pl-sm-2 pa-2">
        <div class="d-flex justify-space-between font-weight-medium">
          <nuxt-link
            :to="{ name: 'home' }"
            class="subtitle-1 font-weight-medium"
            >{{ comment.user.username }}</nuxt-link
          >
          <span
            class="ml-2 date"
            v-text="
              getDateChrono(comment.date_created, {
                monthFormat: 'monthDayHourMinute',
                yearmonthFormat: 'yearMonthDayHourMinute',
                yesterdayFormat: 'hourMinute',
              })
            "
          />
        </div>
        <div v-if="$breakpoint.xsOnly">
          <TitleCommentActions
            :comment="comment"
            :waiter="waiter.rate"
            :is-owner="isOwner"
            @ratecomment="onRateComment"
            @reply="onReply"
          />
        </div>

        <TitleCommentText
          v-if="$breakpoint.smAndUp"
          :comment="comment"
          class="comment-text flex-grow-1"
        />

        <div v-if="$breakpoint.smAndUp" class="mt-2">
          <TitleCommentActions
            :comment="comment"
            :waiter="waiter.rate"
            :is-owner="isOwner"
            @ratecomment="onRateComment"
            @reply="onReply"
          />
        </div>
      </div>
    </div>
    <TitleCommentText
      v-if="$breakpoint.xsOnly"
      :comment="comment"
      class="comment-text flex-grow-1 px-2"
      :class="{ 'owner-text': isOwner }"
    />
    <div v-if="comment.replies" class="my-2">
      <div class="d-flex justify-center">
        <v-btn
          x-small
          text
          type="button"
          :loading="$wait.is(waiter.replies)"
          @click="onOpenReplies"
        >
          <span>
            {{
              showReplies
                ? $t('comments.hideReplies')
                : $t('comments.showReplies', { count: comment.replies })
            }}
            <v-icon x-small>
              {{ showReplies ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </v-icon>
          </span>
        </v-btn>
      </div>
      <v-slide-y-transition>
        <div v-if="showReplies" class="replies">
          <template v-for="(reply, i) in comment.repliesList">
            <TitleComment
              :key="reply.id"
              :comment="reply"
              :title-id="titleId"
              autofocus
              @submit="onSubmit"
            />
            <v-divider
              v-if="i + 1 < comment.replies.length"
              :key="`d_${reply.id}`"
              inset
            ></v-divider>
          </template>
        </div>
      </v-slide-y-transition>
      <div
        v-if="showReplies && comment.repliesList.length > 5"
        class="d-flex justify-center"
      >
        <v-btn
          x-small
          text
          type="button"
          :loading="$wait.is(waiter.replies)"
          @click="onOpenReplies"
        >
          <span>
            {{
              showReplies
                ? $t('comments.hideReplies')
                : $t('comments.showReplies', { count: comment.replies })
            }}
            <v-icon x-small>
              {{ showReplies ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </v-icon>
          </span>
        </v-btn>
      </div>
    </div>
    <v-slide-y-transition>
      <TitleCommentForm
        v-if="replyTo"
        :reply-to="replyTo"
        :title-id="titleId"
        autofocus
        class="mb-2"
        @cancel="cancelReply"
        @submit="onSubmit"
      />
    </v-slide-y-transition>
  </div>
</template>

<script>
import { useDatetime } from '~/mixins/Datetime'
import { EImageSize } from '~/types/core'
export default {
  name: 'TitleComment',
  props: {
    comment: { type: Object, required: true },
    titleId: { type: [String, Number], required: true },
  },
  data() {
    return {
      imageSize: EImageSize.SMALL,
      replyTo: null,
      showReplies: false,
      waiter: {
        rate: `title.comment.${this.comment.id}.rate.`,
        replies: `title.comment.${this.comment.id}.replies`,
      },
    }
  },
  computed: {
    imageHeight() {
      return this.$breakpoint.xsOnly ? 40 : 60
    },
    isOwner() {
      return this.$auth.loggedIn && this.comment.user.id === this.$auth.user.id
    },
  },
  methods: {
    getDateChrono: useDatetime().getDateChrono,
    onOpenReplies() {
      if (typeof this.comment.repliesList === 'undefined') {
        this.$wait.start(this.waiter.replies)
        this.$axios
          .$get(`comments/replies/${this.comment.id}/`, { progress: false })
          .then((replies) => {
            this.comment.repliesList = replies
            this.$wait.end(this.waiter.replies)
            this.showReplies = !this.showReplies
          })
      } else {
        this.showReplies = !this.showReplies
      }
    },
    onReply(comment) {
      if (this.$auth.loggedIn) {
        this.replyTo = comment
      } else {
        this.$toast.error(this.$t('comments.authToReply'), {
          queue: false,
        })
      }
    },
    cancelReply() {
      this.replyTo = null
    },
    onSubmit(comment) {
      this.$emit('submit', comment)
      this.cancelReply()
    },
    onRateComment(rateValue) {
      if (this.$auth.loggedIn) {
        this.$wait.start(`${this.waiter.rate}${rateValue}`)

        if (!this.comment.rate || this.comment.rate.rate !== rateValue) {
          this.$axios
            .$post(
              'comments/rates/',
              {
                comment: this.comment.id,
                rate: rateValue,
              },
              { progress: false }
            )
            .then((rate) => {
              this.performRateComment(rate)
            })
            .finally(() => {
              this.$wait.end(`${this.waiter.rate}${rateValue}`)
            })
        } else {
          this.$axios
            .delete(`comments/rates/${this.comment.rate.id}/`, {
              progress: false,
            })
            .then(() => {
              this.performUnrateComment(rateValue)
            })
            .finally(() => {
              this.$wait.end(`${this.waiter.rate}${rateValue}`)
            })
        }
      } else {
        this.$toast.error(this.$t('comments.authToRate'), {
          queue: false,
        })
      }
    },
    performRateComment(rate) {
      if (this.comment.rate) {
        switch (
          Object.keys(this.$settings.COMMENT_RATES).find(
            (key) =>
              this.$settings.COMMENT_RATES[key] === this.comment.rate.rate
          )
        ) {
          case 'LIKE':
            this.comment.likes--
            break
          case 'DISLIKE':
            this.comment.dislikes--

            break
        }
      }

      switch (
        Object.keys(this.$settings.COMMENT_RATES).find(
          (key) => this.$settings.COMMENT_RATES[key] === rate.rate
        )
      ) {
        case 'LIKE':
          this.comment.likes++
          break
        case 'DISLIKE':
          this.comment.dislikes++

          break
      }
      this.comment.rate = rate
    },
    performUnrateComment(rateValue) {
      switch (
        Object.keys(this.$settings.COMMENT_RATES).find(
          (key) => this.$settings.COMMENT_RATES[key] === rateValue
        )
      ) {
        case 'LIKE':
          this.comment.likes--
          break
        case 'DISLIKE':
          this.comment.dislikes--
          break
      }
      this.comment.rate = null
    },
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';

.date {
  line-height: 1.75rem;
}
$owner-border: 4px solid var(--v-primary-base);

// .owner {
//   border-right: $owner-border;
//   border-radius: $border-radius-root;
//   @media #{map-get($display-breakpoints, 'xs-only')} {
//     border-bottom-right-radius: 0;
//   }
// }
// .owner-text {
//   border-right: $owner-border;
//   border-radius: $border-radius-root;
//   border-top-right-radius: 0;
// }
.comment-text {
  word-break: break-word;
}
.replies {
  margin-left: $comments-divider-indent-xs / 2;
  padding-left: $comments-divider-indent-xs / 2;
  // border-left: thin solid var(--v-primary-base);

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    & {
      margin-left: $comments-divider-indent / 2;
      padding-left: $comments-divider-indent / 2;
    }
  }

  .v-divider--inset:not(.v-divider--vertical) {
    margin-right: $comments-divider-indent-xs;
    margin-left: $comments-divider-indent-xs;
  }
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-divider--inset:not(.v-divider--vertical) {
      margin-left: $comments-divider-indent;
      margin-right: $comments-divider-indent;
    }
  }
}
</style>
