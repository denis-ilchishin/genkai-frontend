<template>
  <v-container>
    <v-flex>
      <v-row>
        <v-col cols="12" class="pb-0 d-flex">
          <h1 class="heading-4 mx-auto titled-border">
            {{ $t('catalog.title') }}
          </h1>
        </v-col>

        <v-col
          cols="12"
          md="8"
          xl="9"
          class="d-flex flex-column"
          :style="{ minHeight: '100%' }"
        >
          <v-fade-transition mode="out-in">
            <v-row v-if="$wait.is(waiter)">
              <v-col
                v-for="loader in limit"
                :key="loader"
                cols="6"
                sm="4"
                lg="3"
                xl="2"
              >
                <v-card flat color="transparent">
                  <v-skeleton-loader type="image" :style="loaderStyles" />
                  <v-skeleton-loader type="heading" class="pb-12 pt-6 pa-2" />
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else-if="titles.length">
              <v-col
                v-for="(title, i) in titles"
                :key="i"
                cols="6"
                sm="4"
                lg="3"
                xl="2"
              >
                <CatalogTitleCard v-if="!$wait.is(waiter)" :title="title" />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <div class="title text-center">
                  {{ $t('catalog.filter.noResults') }}
                </div>
              </v-col>
            </v-row>
          </v-fade-transition>
          <v-row class="flex-grow-0">
            <v-col cols="12" class="justify-center">
              <v-pagination
                v-model="page"
                :length="Math.ceil(total / limit)"
                :total-visible="9"
                color="primary"
              ></v-pagination>
            </v-col>
            <v-col cols="12">
              <v-card flat color="transparent">
                <v-card-text
                  class="text-center"
                  v-html="$t('catalog.meta.description')"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="$breakpoint.mdAndUp"
          class="desktop-filter"
          cols="12"
          md="4"
          xl="3"
        >
          <v-card
            class="my-3"
            :loading="$wait.is(waiter)"
            flat
            color="transparent"
          >
            <v-card-text>
              <LazyCatalogFilter
                :filter.sync="filter"
                :disabled="$wait.is(waiter)"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-navigation-drawer
          v-if="$breakpoint.smAndDown"
          v-model="filterDrawer"
          :width="$settings.SIDENAV_WIDTH"
          fixed
          right
          dark
          color="secondary"
          disable-route-watcher
        >
          <template v-slot:prepend>
            <div class="text-center headline white--text my-4">
              {{ $helpers.c($t('catalog.filter.title')) }}
            </div>
            <v-divider></v-divider>
          </template>
          <v-col>
            <LazyCatalogFilter
              id="mobile-filter"
              :filter.sync="filter"
              :disabled="$wait.is(waiter)"
              menu-absolute
            />
          </v-col>
        </v-navigation-drawer>

        <v-btn
          v-show="$breakpoint.smAndDown"
          ref="filterBtn"
          fab
          fixed
          bottom
          right
          color="primary"
          elevation="10"
          :style="filterBtnFDStyles"
          @click="filterDrawer = !filterDrawer"
        >
          <img :src="filterIcon" />
        </v-btn>
        <tap-target
          v-if="$breakpoint.smAndDown"
          :show="filterBtnFDShow"
          :target="filterBtn"
          :background-color="$vuetify.theme.currentTheme.secondary"
          color="#ffffff"
          content-location="nw"
          :title="$t('catalog.filter.featureDiscovery.title')"
          :content="$t('catalog.filter.featureDiscovery.subtitle')"
          size="70vw"
          @close="onFDClose"
        />
      </v-row>
    </v-flex>
  </v-container>
</template>

<script>
import QS from 'qs'
import { mapGetters } from 'vuex'
import { isEquivalent } from '@/plugins/functions'

export default {
  name: 'Catalog',
  asyncData({ query, $axios, $settings }) {
    const defaultOrdering = $settings.FILTER_ORDERINGS.RATING
    const limit = 24
    const page = query.page || 1
    const filters = [
      'type',
      'status',
      'genres',
      'soucres',
      'studios',
      'age_rating',
      'year__lte',
      'year__gte',
      'countries',
      'year_season',
      'ordering',
    ]
    const filter = {}

    filters.forEach((val) => {
      if (val === 'ordering') {
        filter[val] = query[val] || defaultOrdering
      } else {
        filter[val] = query[val]
      }
    })

    return $axios
      .get('titles/titles/', {
        params: {
          page,
          limit,
          ...filter,
        },
        paramsSerializer: (params) =>
          QS.stringify(params, { arrayFormat: 'repeat' }),
      })
      .then(({ data: { next, results, count } }) => {
        return {
          titles: results,
          next,
          total: count,
          filter,
          limit,
          page,
          defaultOrdering,
        }
      })
      .catch(() => {})
  },
  data() {
    return {
      filterIcon: require('~/icons/filter.svg'),
      filterDrawer: false,
      filterBtnFDCacheKey: 'catalog.showFeatureDiscovery',
      filterBtnFDShow: false,
      filterBtn: null,
      waiter: 'catalog.fetching',
      timer: null,
      loaderStyles: {
        paddingTop: `${(1 / this.$settings.IMAGE_WIDTH_RATIO) * 100}%`,
      },
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
    filterBtnFDStyles() {
      return {
        bottom: this.isMobile
          ? `${this.$settings.BOTNAV_HEIGHT + 10}px`
          : '8px',
      }
    },
  },
  watch: {
    filter: {
      handler(to, from) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.page = 1
          this.total = this.next = null
          this.load()
        }, 500)
      },
      deep: true,
    },
    filterDrawer(to) {
      if (to) {
        this.filterBtnFDShow = false
      }
    },
    filterBtnFDShow(to) {
      if (!to) {
        this.$auth.$storage.setLocalStorage(this.filterBtnFDCacheKey, false)
      }
    },
    page(to) {
      this.load()
    },
    '$breakpoint.smAndDown'(to) {
      if (!to) {
        this.filterDrawer = false
      }
    },
  },
  created() {
    // this.load()
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.filterBtn) {
        this.filterBtn = this.$refs.filterBtn.$el
        const alreadySeen = !(
          this.$auth.$storage.getLocalStorage(this.filterBtnFDCacheKey) === null
        )
        if (!alreadySeen && this.$breakpoint.smAndDown) {
          this.filterBtnFDShow = true
        }
      }
    })
  },
  methods: {
    load() {
      if (!isEquivalent(this.$route.query, this.getQuery(), true)) {
        this.$wait.start(this.waiter)

        this.$vuetify.goTo('#application')
        this.$axios
          .get('titles/titles/', {
            params: {
              page: this.page,
              limit: this.limit,
              ...this.filter,
            },
            paramsSerializer: (params) =>
              QS.stringify(params, { arrayFormat: 'repeat' }),
          })
          .then(({ data: { next, results, count } }) => {
            this.$wait.end(this.waiter)
            this.titles = results
            this.next = next
            this.total = count
            this.$router.replace({ name: 'catalog', query: this.getQuery() })
          })
          .catch(() => {})
      }
    },
    getQuery() {
      /* eslint no-fallthrough: off */
      const result = {}
      const values = { ...this.filter, page: this.page }
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const value = values[key]
          if (!value) continue

          switch (key) {
            case 'page':
              if (parseInt(value) < 2) break
            case 'ordering':
              if (value === this.defaultOrdering) break
            default:
              result[key] = value
          }
        }
      }

      return result
    },
    onFDClose() {
      this.filterBtnFDShow = false
      this.$auth.$storage.setLocalStorage(this.filterBtnFDCacheKey, false)
    },
  },
  head() {
    return {
      title: this.$t('meta.catalog.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.catalog.metas.description'),
        },
        {
          name: 'keywords',
          vmid: 'keywords',
          content: this.$t('meta.catalog.metas.keywords'),
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--single-line::v-deep
  .v-input__append-inner {
  margin-top: 5px;
}

.desktop-filter {
  .v-card {
    position: sticky;
    top: 40px;
  }
}
.v-skeleton-loader::v-deep {
  height: auto;
  width: 100%;
  position: relative; /* If you want text inside of it */
  .v-skeleton-loader__image {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
  }
}
</style>
