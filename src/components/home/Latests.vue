<template>
  <Carousel
    id="latests-carousel"
    :titles="titles"
    :heading="$t('home.latests.title')"
    :to="{ name: 'catalog' }"
    waiter="home.latests"
    icon="fiber_new"
  >
    <template v-slot:caption="{ title }">
      <span class="carousel-caption-inline title-type">
        {{ types[title.type] }}
      </span>
      <span class="carousel-caption-inline title-year">
        {{ title.year }}
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
import { ILatestTitle } from '~/types/title'
import { useFormatTitleGenres } from '~/mixins/Title'
import { useCommon } from '~/composables/common'

export default defineComponent({
  name: 'HomeLatestSeason',
  props: {
    titles: { type: Array as () => ILatestTitle[], required: true },
  },
  setup(props) {
    const { store, $helpers } = useContext()
    const { isMobile } = useCommon()
    const types = store.getters['config/types']
    const defaultGenresLength = 3
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
#latests-carousel::v-deep {
  .title-year {
    top: $carousel-caption-offset;
    right: $carousel-caption-offset;
    left: auto;
  }
  .title-type {
    top: $carousel-caption-offset;
  }
  .title-genres {
    bottom: $carousel-caption-offset;
  }
}
</style>
