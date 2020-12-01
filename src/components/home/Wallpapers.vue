<template>
  <v-row ref="carouselWrap">
    <v-col>
      <v-carousel
        v-model="onboarding"
        continuous
        hide-delimiters
        cycle
        :show-arrows="false"
        class="rounded-lg"
      >
        <v-carousel-item v-for="(title, i) in shuffledTitles" :key="i">
          <v-lazy :style="{ height: '100%' }">
            <v-card
              width="100%"
              :to="{ name: 'title-slug', params: { slug: title.slug } }"
            >
              <Wallpaper
                :image-set="title.wallpaper"
                :image-size-set="imageSizeSet"
                :max-height="`${maxHeight}px`"
                :alt="title.name"
                :title="title.name"
                width="100%"
                height="100%"
              />
            </v-card>
          </v-lazy>
        </v-carousel-item>
        <v-btn class="prev rounded-l-lg" text @click="prev">
          <v-icon x-large>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-btn class="next rounded-r-lg" text @click="next">
          <v-icon x-large>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-carousel>
    </v-col>
  </v-row>
</template>

<script>
import { shuffleArray } from '~/plugins/functions'
export default {
  name: 'HomeWallpapers',
  props: {
    titles: { type: Array }
  },
  data() {
    return {
      maxHeight: 350,
      minHeight: 0,
      imageSizeSet: { xs: 'xsmall', sm: 'small', md: 'medium', lg: 'big' },
      onboarding: 0
    }
  },
  computed: {
    shuffledTitles() {
      const result = this.titles.slice(0)
      shuffleArray(result)
      return result
    }
  },
  methods: {
    next() {
      this.onboarding =
        this.onboarding + 1 === this.titles.length ? 0 : this.onboarding + 1
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 < 0 ? this.titles.length - 1 : this.onboarding - 1
    }
  }
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';

.v-carousel::v-deep {
  height: auto !important;
  .v-window-item,
  .loader-container {
    width: 100%;
    padding-top: calc(0.41 * 100%);
    position: relative;
  }
  .v-carousel__item,
  .loader {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .v-carousel__item {
    height: auto !important;
  }
  .loader {
    height: 100% !important;
  }

  .next,
  .prev {
    position: absolute;
    top: 0;
    height: 100% !important;
    display: flex;
    align-items: center;
    margin: 0;
    border-radius: 0;
    width: 48px;
    padding: 0px !important;
    min-width: auto !important;
  }
  .prev {
    left: 0;
    // border-top-left-radius: $border-radius-root;
    // border-bottom-left-radius: $border-radius-root;
  }
  .next {
    right: 0;
    // border-top-right-radius: $border-radius-root;
    // border-bottom-right-radius: $border-radius-root;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-window-item,
    .loader-container {
      padding-top: calc(0.23 * 100%);
    }
  }
}
</style>
