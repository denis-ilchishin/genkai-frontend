<template>
  <Carousel
    id="current-season-carousel"
    :titles="titles"
    :heading="$t('home.currentSeason.title', { year: '2020', season: 'осень' })"
    waiter="home.currentSeason"
    icon="date_range"
  >
    <template v-slot:caption="{ title }">
      <span class="carousel-caption-inline title-type">
        {{ types[title.type] }}
      </span>
      <span class="carousel-caption-inline title-episode">
        {{
          $t('home.currentSeason.lastEpisode', {
            episode: title.last_episode,
          })
        }}
      </span>
      <span
        v-if="!isMobile"
        class="carousel-caption-block title-genres text-truncate"
        :title="getTitleGenresString(title, titles.length)"
      >
        {{ getTitleGenresString(title) }}
      </span>
    </template>
  </Carousel>
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
} from '@nuxtjs/composition-api'
import { EImageSize } from '~/types/core'
import Flickity from 'flickity'
import { ICurrentSeasonTitle } from '~/types/title'
import { useFormatTitleGenres } from '~/mixins/Title'
import { useCommon } from '~/composables/common'

export default defineComponent({
  name: 'HomeCurrentSeason',
  props: {
    titles: { type: Array as () => ICurrentSeasonTitle[], required: true },
  },
  setup(props) {
    const { store, $helpers } = useContext()
    const { isMobile } = useCommon()
    const types = store.getters['config/types']
    const getTitleGenresString = useFormatTitleGenres

    return {
      getTitleGenresString,
      types,
      isMobile,
    }
  },
})
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
#current-season-carousel::v-deep {
  .title-episode {
    bottom: ($carousel-caption-offset * 2) + $carousel-caption-height;
  }
  .title-type {
    top: $carousel-caption-offset;
  }
  .title-genres {
    bottom: $carousel-caption-offset;
  }
}
.is-mobile {
  #current-season-carousel::v-deep {
    .title-episode {
      bottom: $carousel-caption-offset;
    }
  }
}
</style>
