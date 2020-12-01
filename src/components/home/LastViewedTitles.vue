<template>
  <LazyCarousel
    v-if="titles.length"
    id="last-viewed-titles-carousel"
    :titles="titles"
    heading="Продолжить просмотр"
    waiter="home.last_viewed_titles"
    icon="history"
    :as-route="false"
    @click="onClick"
  >
    <template v-slot:caption="{ title }">
      <span
        v-show="
          !isMobile || (isPlayerOpening && title.slug === isPlayerOpening.slug)
        "
        class="carousel-caption-inline continue"
        title="Продолжить просмотр"
      >
        <v-fade-transition mode="out-in">
          <v-icon v-if="!isPlayerOpening" x-large>play_arrow</v-icon>
          <v-progress-circular v-else indeterminate></v-progress-circular>
        </v-fade-transition>
      </span>
      <span
        v-if="!isMovie(title.status)"
        class="carousel-caption-inline title-episode"
      >
        <span v-if="title.episode.number">
          {{ title.episode.number }}-й эпизод
        </span>
        <span v-else>{{ title.episode.name }}</span>
      </span>
      <span class="carousel-caption-block title-translator">
        {{ title.translator.name }}
      </span>
    </template>
  </LazyCarousel>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { shuffleArray } from '~/plugins/functions'

import {
  defineComponent,
  ref,
  useContext,
  computed,
  onMounted,
  useAsync,
} from '@nuxtjs/composition-api'
import { EImageSize } from '~/types/core'
import Flickity from 'flickity'
import { ILatestTitle } from '~/types/title'
import { useFormatTitleGenres } from '~/mixins/Title'
import { useCommon } from '~/composables/common'
import { usePlayerBase } from '~/composables/player/base'

export default defineComponent({
  name: 'HomeLastViewedTitles',
  props: {
    viewedEpisodes: {
      type: Array,
      required: true,
    },
  },

  setup(props) {
    const { $axios } = useContext()
    const { play, isPlayerOpening } = usePlayerBase()
    const { isMobile, isMovie } = useCommon()
    const titles = computed(() =>
      props.viewedEpisodes
        ? props.viewedEpisodes.map((v: any) => ({
            ...v.title,
            episode: v.episode,
            translator: v.translator,
          }))
        : []
    )
    const onClick = (title: any) => {
      if (!isPlayerOpening.value) {
        play(title)
      }
    }

    return {
      titles,
      onClick,
      isMovie,
      isMobile,
      isPlayerOpening,
    }
  },
})
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
#last-viewed-titles-carousel::v-deep {
  .title-translator {
    top: $carousel-caption-offset;
    // bottom: $carousel-caption-height + ($carousel-caption-offset * 2);
  }
  .title-episode {
    bottom: $carousel-caption-offset;
  }
  .continue {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      transition: inherit;
      font-size: 64px;
    }
  }
}
</style>
