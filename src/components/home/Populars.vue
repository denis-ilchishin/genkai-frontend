<template>
  <Carousel
    id="populars-carousel"
    :titles="titles"
    :heading="$t('home.populars.title')"
    icon="insert_chart"
    waiter="home.populars"
  >
    <template v-slot:heading-extend>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon x-small v-on="on">
            <v-icon>help</v-icon>
          </v-btn>
        </template>
        <div class="text-center">
          <div v-text="$t('home.populars.help[0]')" />
          <div class="caption" v-text="$t('home.populars.help[1]')" />
          <div class="caption" v-text="$t('home.populars.help[2]')" />
        </div>
      </v-tooltip>
    </template>

    <template v-slot:caption="{ title }">
      <span class="carousel-caption-inline title-type">
        {{ types[title.type] }}
      </span>
      <span
        v-if="!isMobile"
        class="carousel-caption-inline title-status caption text-uppercase"
        :style="{
          backgroundColor: $settings.TITLE_STATUS_COLORS[title.status],
        }"
      >
        {{ statuses[title.status] }}
      </span>
      <span class="carousel-caption-inline title-rank">
        № <span class="title number">{{ title.relevant_data.rank }}</span>

        в рейтинге
      </span>
      <span
        v-if="
          parseInt(title.relevant_data.rank_previous) &&
          title.relevant_data.rank_previous > title.relevant_data.rank
        "
        class="carousel-caption-inline title-rank-difference"
        :title="
          $tc('home.populars.rankDifference.up', getRankDifference(title), {
            difference: getRankDifference(title),
          })
        "
      >
        <span class="success--text number" v-text="getRankDifference(title)" />
        <v-icon small color="success">trending_up</v-icon>
      </span>
      <span
        v-else-if="
          parseInt(title.relevant_data.rank_previous) &&
          title.relevant_data.rank_previous < title.relevant_data.rank
        "
        class="carousel-caption-inline title-rank-difference"
        :title="
          $tc('home.populars.rankDifference.down', getRankDifference(title), {
            difference: getRankDifference(title),
          })
        "
      >
        <span class="error--text number" v-text="getRankDifference(title)" />
        <v-icon small color="error">trending_down</v-icon>
      </span>
    </template>
  </Carousel>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useCommon } from '~/composables/common'
import { IPopularTitle } from '~/types/title'

export default defineComponent({
  name: 'HomePopulars',
  props: {
    titles: { required: true, type: Array as () => IPopularTitle[] },
  },
  setup() {
    const { store } = useContext()
    const { isMobile } = useCommon()
    const statuses: any[] = store.getters['config/statuses']
    const types: any[] = store.getters['config/types']
    const getRankDifference = (title: IPopularTitle) => {
      return Math.abs(
        parseInt(title.relevant_data.rank as string) -
          parseInt(title.relevant_data.rank_previous as string)
      )
    }

    return {
      statuses,
      types,
      getRankDifference,
      isMobile,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';

#populars-carousel::v-deep {
  .title-rank {
    bottom: $carousel-caption-offset;
  }

  .title-type {
    top: $carousel-caption-offset;
  }

  .title-status {
    top: $carousel-caption-offset;
    right: $carousel-caption-offset;
    left: auto;
  }
  .title-rank-difference {
    bottom: $carousel-caption-offset;
    right: $carousel-caption-offset;
    left: auto;
    span {
      font-weight: 600 !important;
    }
  }
}
.is-mobile {
  #populars-carousel::v-deep {
    .title-status {
      right: auto;
      top: auto;
      bottom: ($carousel-caption-offset * 2) + $carousel-caption-height + 3px;
      left: $carousel-caption-offset;
    }
  }
}
</style>
