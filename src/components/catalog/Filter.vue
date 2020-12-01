<template>
  <div>
    <v-row>
      <v-col class="d-flex">
        <v-range-slider
          v-model="year"
          :max="yearMax"
          :min="yearMin"
          hide-details
          class="align-center mt-8"
          thumb-label="always"
          :label="$helpers.c($t('title.year'))"
          :disabled="disabled"
        ></v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="filterObj.ordering"
          :items="
            Object.keys(orderings).map((ordering) => ({
              value: ordering,
              text: $helpers.c(orderings[ordering]),
            }))
          "
          :label="$helpers.c($t('catalog.filter.ordering.label'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="filterObj.type"
          :items="
            Object.keys(types).map((type) => ({
              value: type,
              text: $helpers.c(types[type]),
            }))
          "
          :label="$helpers.c($t('title.type'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="filter-status"
          v-model="filterObj.status"
          :items="
            Object.keys(statuses).map((status) => ({
              value: status,
              text: $helpers.c(statuses[status]),
            }))
          "
          :label="$helpers.c($t('title.status'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="filter-genres"
          v-model="filterObj.genres"
          :items="genres.slice(0)"
          item-text="name"
          item-value="slug"
          :label="$helpers.c($t('title.genres'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          multiple
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="filter-age_rating"
          v-model="filterObj.age_rating"
          :items="
            Object.keys(ageRatings).map((ageRating) => ({
              value: ageRating,
              text: $helpers.c(ageRatings[ageRating]),
            }))
          "
          :label="$helpers.c($t('title.ageRating'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="filter-source"
          v-model="filterObj.source"
          :items="
            Object.keys(sources).map((source) => ({
              value: source,
              text: $helpers.c(sources[source]),
            }))
          "
          :label="$helpers.c($t('title.source'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="filter-studios"
          v-model="filterObj.studios"
          :items="studios.slice(0)"
          item-text="name"
          item-value="slug"
          :label="$helpers.c($t('title.studios'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          multiple
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="filter-year_season"
          v-model="filterObj.year_season"
          :items="
            Object.keys(yearSeasons).map((yearSeason) => ({
              value: yearSeason,
              text: $helpers.c(yearSeasons[yearSeason]),
            }))
          "
          :label="$helpers.c($t('title.yearSeason'))"
          :disabled="disabled"
          filled
          rounded
          hide-details
          cache-items
          clearable
          dense
          class="rounded-lg"
          v-bind="
            menuAbsolute ? { attach: '', 'menu-props': { absolute: true } } : {}
          "
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    filter: {
      required: true,
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
    menuAbsolute: {
      type: Boolean,
    },
  },
  data() {
    const yearMin = parseInt(
      this.$store.getters['config/input']('catalog.filter.min_year', 1950)
    )
    const yearMax = parseInt(
      this.$store.getters['config/input']('catalog.filter.max_year', 2100)
    )

    return {
      filterObj: this.filter,
      yearMin,
      yearMax,
      year: [
        this.filter.year__gte || yearMin,
        this.filter.year__lte || yearMax,
      ],
      yearChangeTimer: null,
      orderings: {
        [this.$settings.FILTER_ORDERINGS.RATING]: this.$t(
          'catalog.filter.ordering.rate'
        ),
        [this.$settings.FILTER_ORDERINGS.VIEWS]: this.$t(
          'catalog.filter.ordering.views'
        ),
        [this.$settings.FILTER_ORDERINGS.YEAR_ASC]: this.$t(
          'catalog.filter.ordering.yearASC'
        ),
        [this.$settings.FILTER_ORDERINGS.YEAR_DESC]: this.$t(
          'catalog.filter.ordering.yearDESC'
        ),
        [this.$settings.FILTER_ORDERINGS.NAME_ASC]: this.$t(
          'catalog.filter.ordering.nameASC'
        ),
        [this.$settings.FILTER_ORDERINGS.NAME_DESC]: this.$t(
          'catalog.filter.ordering.nameDESC'
        ),
      },
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
      'ageRatings',
    ]),
    // yearTicks() {
    //   const lables = []
    //   let start = parseInt(this.yearMin)
    //   lables.push(start)
    //   start += 1
    //   while (start < this.yearMax) {
    //     if (start % 20 === 0) {
    //       lables.push(start)
    //     } else {
    //       lables.push('')
    //     }
    //     start += 1
    //   }

    //   return lables
    // },
  },
  watch: {
    filterObj(to) {
      this.$emit('update:filter', to)
    },
    year: {
      deep: false,
      handler(range, old) {
        if (this.yearChangeTimer) clearTimeout(this.yearChangeTimer)

        this.yearChangeTimer = setTimeout(() => {
          const [start, end] = range
          this.filterObj.year__lte = end < this.yearMax ? end : undefined
          this.filterObj.year__gte = start > this.yearMin ? start : undefined
        }, 500)
      },
    },
  },
}
</script>

<style scoped lang="scss">
.col::v-deep {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  .v-input__control + .v-menu__content {
    min-width: 100% !important;
    width: 100% !important;
  }
}
</style>
