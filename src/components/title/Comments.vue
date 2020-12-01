<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card flat color="transparent">
          <v-card-title class="pt-0">
            <h2 class="heading-5 titled-border mx-auto mx-md-0">
              {{ $t('comments.title') }}
            </h2>
          </v-card-title>
          <v-card-text>
            <TitleCommentForm
              class="mb-4"
              :title-id="title.slug"
              @submit="onSubmit"
            />

            <div
              class="d-flex flex-column flex-md-row justify-md-space-between"
            >
              <span class="title text-center text-md-left">
                {{ $helpers.c($t('comments.titleList')) }}
              </span>
              <v-menu>
                <template v-slot:activator="{ on }">
                  <div class="d-flex justify-center justify-md-start">
                    <v-btn small text v-on="on">
                      <v-icon left>filter_list</v-icon>
                      {{ $t('comments.ordering', { ordering: orderingText }) }}
                    </v-btn>
                  </div>
                </template>
                <v-list>
                  <v-list-item
                    v-for="_ordering in orderings"
                    :key="_ordering.value"
                    link
                    @click="ordering = _ordering.value"
                  >
                    {{ _ordering.text }}
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-fade-transition mode="out-in">
              <div
                v-if="$wait.is(waiter.loading)"
                class="d-flex justify-center"
              >
                <v-progress-circular size="50" color="primary" indeterminate />
              </div>
              <div v-else id="comments-list" class="mt-4">
                <v-fade-transition group>
                  <template v-for="(comment, i) in comments">
                    <TitleComment
                      :key="comment.id"
                      :comment="comment"
                      :title-id="title.slug"
                      @submit="onSubmit"
                    />
                    <v-divider
                      v-if="i + 1 < comments.length"
                      :key="`d_${comment.id}`"
                      inset
                    ></v-divider>
                  </template>
                </v-fade-transition>
                <div v-if="next" class="d-flex justify-center">
                  <v-btn
                    small
                    color="primary"
                    :loading="$wait.is(waiter.loadingMore)"
                    @click="load"
                  >
                    {{ $t('comments.loadMore') }}
                  </v-btn>
                </div>
              </div>
            </v-fade-transition>
            <div
              v-if="$wait.is(waiter.loading) ? false : !loaded"
              class="d-flex justify-center"
            >
              <v-btn small color="primary" @click="load">
                {{ $t('comments.load') }}
              </v-btn>
            </div>
            <p
              v-else-if="loaded && !comments.length"
              class="body-1 text-center"
            >
              {{ $helpers.c($t('comments.noRecords')) }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiter: {
        loading: 'comments.loading',
        loadingMore: 'comments.loadingMore',
      },
      orderings: [
        {
          value: '-date_created',
          text: this.$t('comments.orderings.dateCreated'),
        },
        {
          value: '-has_rates,-rating',
          text: this.$t('comments.orderings.rating'),
        },
      ],
      ordering: '-date_created',
      loaded: false,
      comments: [],
      next: null,
    }
  },
  computed: {
    orderingText() {
      return this.orderings.find((o) => o.value === this.ordering).text
    },
  },
  watch: {
    ordering() {
      this.comments = []
      this.next = null
      this.loaded = false
      this.load()
    },
    title() {
      this.comments = []
      this.next = null
      this.loaded = false
    },
  },
  // mounted() {
  //   document.addEventListener('click', this.spoilerEventListener)
  // },
  // beforeDestroy() {
  //   document.removeEventListener('click', this.spoilerEventListener)
  // },
  methods: {
    onSubmit(comment) {
      if (this.loaded) {
        if (!comment.reply_to) {
          this.comments.unshift(comment)
        } else {
          const repliedToComment = this.comments.find(
            (c) => c.group === comment.group
          )
          if (repliedToComment) {
            // show the new added reply only if replies are already loaded
            // otherwise, only increment replies counter
            if (typeof repliedToComment.repliesList !== 'undefined') {
              repliedToComment.repliesList.push(comment)
            }
            repliedToComment.replies++
          }
        }
      }
    },
    load() {
      let waiter = this.waiter.loading

      if (this.next) {
        waiter = this.waiter.loadingMore
      }

      this.$wait.start(waiter)

      // Load next page(if exists) or first page
      this.$axios
        .$get(this.next || `comments/titles/${this.title.slug}/`, {
          params: { ordering: this.ordering },
        })
        .then(({ results, next }) => {
          this.comments.push(...results)
          this.next = next
          this.loaded = true
        })
        .catch((err) => {
          this.$pr(err)
        })
        .finally(() => {
          this.$wait.end(waiter)
        })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';

#comments-list {
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
