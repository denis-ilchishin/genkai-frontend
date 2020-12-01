<template>
  <v-card
    v-ripple="false"
    class="card"
    :to="{ name: 'title-slug', params: { slug: title.slug } }"
    :title="title.name"
    nuxt
    flat
    color="transparent"
  >
    <div class="image-wrapper">
      <BaseImage
        :image-set="title.poster"
        :image-size="imageSize"
        :height="200"
        :title="title.name"
        :alt="title.name"
        class="rounded"
      />
      <TitleRatingChip :title="title" />
    </div>
    <v-card-title class="justify-center text-center flex-column body-1">
      <span class="mb-2 overline">{{ types[title.type] }}</span>
      {{ title.name }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { EImageSize } from '~/types/core'
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { store } = useContext()
    return {
      imageSize: {
        xs: EImageSize.MEDUIM,
        lg: EImageSize.BIG,
      },
      // we don't use computed here, because all of these values are loaded on from server once, and usually won't be updated
      genres: store.getters['config/genres'],
      yearSeasons: store.getters['config/yearSeasons'],
      studios: store.getters['config/studios'],
      countries: store.getters['config/countries'],
      statuses: store.getters['config/statuses'],
      sources: store.getters['config/sources'],
      types: store.getters['config/types'],
      isMobile: store.getters['config/isMobile'],
    }
  },
})
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
.card {
  height: 100%;
  max-width: calc(500px / 1.39);
  margin: 0 auto;
}
.image-wrapper::v-deep {
  position: relative;
  img {
    width: 100%;
    height: auto !important;
  }
  picture {
    padding-top: #{$poster-ratio-height * 100%};
    width: 100%;
    height: auto;
  }
}

.v-card__title {
  font-size: 1rem;
  line-height: 1rem;
}

.v-application {
  .title-rating-chip {
    position: absolute;
    bottom: 5px;
  }
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
  .v-card__title {
    font-size: 1.15rem;
  }

  .v-application {
    .title-rating-chip {
      left: calc(50% - (92px / 2));
      font-size: 1.25rem !important;
    }
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .v-application {
    .title-rating-chip {
      padding-left: 8px !important;
      padding-right: 8px !important;
      $width: 64px;
      width: $width !important;
      left: calc(50% - #{$width / 2});
      font-size: 1rem !important;
      height: 28px;
    }
  }
}

// @media #{map-get($display-breakpoints, 'lg-and-up')} {
//   .card {
//     max-width: calc(500px / 1.39);
//   }
// }
</style>
