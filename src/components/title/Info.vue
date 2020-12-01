<template>
  <v-container>
    <v-card color="transparent" flat class="title-info">
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="12" md="4" xl="3" class="order-1 order-md-2">
            <a href="javascript:void(0)" @click="openFullsizePoster">
              <BaseImage
                :image-set="title.poster"
                :image-size="imageSize"
                :title="title.name"
                :height="375"
                :alt="title.name"
                class="rounded-lg mx-auto"
              />
            </a>
            <div v-if="!isAnnounce" class="d-flex justify-center mt-2">
              <TitleRating :title="title" />
            </div>
            <div class="d-flex justify-center mt-2">
              <TitleStatusChip
                :title="title"
                :class="isAnnounce ? '' : 'mr-2'"
              />
              <TitleRatingChip v-if="!isAnnounce" :title="title" />
            </div>

            <div
              v-if="!isAnnounce && hasEpisodes"
              class="d-flex justify-center mt-4"
            >
              <v-btn
                color="primary"
                large
                class="rounded-xl"
                :loading="Boolean(isPlayerOpening)"
                @click="play(title)"
              >
                <v-icon left x-large>play_arrow</v-icon>
                Смотреть онлайн
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="8" xs="9" class="order-3">
            <h1
              class="mt-1 font-weight-bold display-1 text-center text-md-left white--text"
            >
              {{ title.name }}
            </h1>
            <div
              v-if="!isAnnounce"
              class="d-flex flex-column flex-md-row justify-center justify-md-start mt-4"
            >
              <TitleUserLists :title="title" />
              <TitleUserSubscriptions :title="title" />
            </div>
            <v-expansion-panels v-if="title.other_names.length" tile flat>
              <v-expansion-panel>
                <v-expansion-panel-header class="px-0 py-2">
                  {{ $helpers.c($t('title.otherNames')) }}
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-0">
                  <ul>
                    <li
                      v-for="(name, i) in title.other_names"
                      :key="i"
                      class="font-weight-bold"
                    >
                      {{ name }}
                    </li>
                  </ul>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <div>
              <table
                v-for="(item, i) in infoList.filter((item) => item.value)"
                :key="i"
              >
                <tbody>
                  <tr>
                    <td>{{ $helpers.c(item.text) }}:&nbsp;</td>
                    <td class="font-weight-bold">
                      {{ $helpers.c(item.value) }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                v-for="group in chips.filter((group) => group.items.length)"
                :key="group.key"
              >
                <tbody>
                  <tr>
                    <td :style="{ verticalAlign: 'top' }">
                      {{ $helpers.c($t(`title.${group.key}`)) }}:&nbsp;
                    </td>
                    <td>
                      <span v-for="(item, i) in group.items" :key="i">
                        <span class="font-weight-bold"
                          >{{ item.name
                          }}{{ group.items.length > i + 1 ? ', ' : '' }}</span
                        >
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="$breakpoint.mdAndUp" class="pt-4">
              <div>{{ title.description }}</div>
              <div class="mt-4">
                <TitleWatchOrder v-if="title.watch_orders" :title="title" />
              </div>
            </div>
          </v-col>

          <v-col v-if="$breakpoint.smAndDown" cols="12" class="order-4">
            <div>{{ title.description }}</div>
            <div class="mt-4">
              <TitleWatchOrder v-if="title.watch_orders" :title="title" />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog
      v-if="title.poster"
      v-model="showFullsizePoster"
      width="max-content"
      overlay-opacity="0.9"
    >
      <v-lazy tag="div">
        <img
          :src="title.poster.original"
          :alt="title.name"
          :title="title.name"
          class="d-block mx-auto original-image"
        />
      </v-lazy>
    </v-dialog>
  </v-container>
</template>

<script>
import { computed, ref } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import { usePlayerBase } from '~/composables/player/base'
import { EImageSize } from '~/types/core'
import { useCommon } from '~/composables/common'

export default {
  name: 'TitleInfo',
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { play, isPlayerOpening } = usePlayerBase()
    const { isAnnounce } = useCommon()
    const hasEpisodes = computed(() => {
      for (const t of props.title.translations) {
        if (t.episodes.length) return true
      }
      return false
    })
    const showFullsizePoster = ref(false)
    const openFullsizePoster = () => {
      showFullsizePoster.value = true
    }

    return {
      play,
      isPlayerOpening,
      hasEpisodes,
      isAnnounce: isAnnounce(props.title.status),
      showFullsizePoster,
      openFullsizePoster,
    }
  },
  data() {
    return {
      showOtherNames: false,
      imageSize: EImageSize.BIG,
      chips: [
        { items: this.title.genres, key: 'genres' },
        { items: this.title.countries, key: 'countries' },
        { items: this.title.studios, key: 'studios' },
      ],
    }
  },
  computed: {
    ...mapGetters('config', [
      'genres',
      'yearSeasons',
      'genres',
      'studios',
      'countries',
      'statuses',
      'sources',
      'types',
    ]),
    infoList() {
      return [
        {
          text: this.$t('title.year'),
          value: this.title.year,
        },
        {
          text: this.$t('title.yearSeason'),
          value: this.yearSeasons[this.title.year_season],
        },
        {
          text: this.$t('title.type'),
          value: this.types[this.title.type],
        },
        {
          text: this.$t('title.duration'),
          value: this.title.duration ? this.title.duration + ' мин' : null,
        },
        {
          text: this.$t('title.source'),
          value: this.sources[this.title.source],
        },
        {
          text: this.$t('title.ageRating'),
          value: this.sources[this.title.age_rating],
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.title-info::v-deep {
  .v-expansion-panels .v-expansion-panel {
    color: inherit;
  }
  .v-expansion-panel--active > .v-expansion-panel-header {
    min-height: 48px;
  }
  .v-expansion-panel-header {
    min-height: 38px;
  }
  .v-expansion-panel-header__icon {
    margin-left: 8px;
    i {
      font-size: 20px;
    }
  }
}
.original-image {
  max-height: 90vh;
  max-width: calc(100vw - 48px);
}
// @import '~/assets/scss/variables';
// .rating {
//   .v-icon {
//     padding: 0.3rem !important;
//   }
//   @media screen and (max-width: #{$xx-small}) {
//     .v-icon {
//       padding: 0.1rem !important;
//     }
//   }
// }
</style>
