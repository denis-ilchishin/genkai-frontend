<template>
  <v-flex xl8 offset-xl2>
    <LazyTitleInfo :title="title" :title-rating="titleRating" />
    <!-- <TitlePlayer
      :title="title"
      :initial-translation="translation"
      :initial-episode="episode"
      :public-key="publicKey"
    /> -->
    <LazyTitleSimilars v-if="title.similars.length" :title="title" />
    <LazyTitleComments :title="title" />
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import { useCommon } from '~/composables/common'
export default {
  name: 'TitlePage',
  setup() {
    const { isOngoing, isMovie, toDuration } = useCommon()
    return { isOngoing, isMovie, toDuration }
  },
  asyncData({ $axios, params, redirect, error }) {
    return $axios
      .$get(`/titles/titles/${params.slug}/`)
      .then((title) => {
        return { title }
      })
      .catch((err) => {
        error({ statusCode: parseInt(err.response.status) })
      })
  },
  data() {
    return {
      titleRating: 0,
    }
  },
  head() {
    const microdata = {
      '@context': 'http://schema.org',
      url: this.$router.resolve({
        name: 'title-slug',
        params: { slug: this.title.slug },
      }).route.path,
      name: this.title.name,
      description: this.title.description,
      dateCreated: new Date(this.title.date_enabled).toISOString(),
      inLanguage: 'Русский',
    }

    if (this.title.poster) {
      microdata.image = this.title.poster.original
    }

    if (this.title.studios.length) {
      microdata.productionCompany = this.title.studios.map((c) => c.name)
    }

    if (this.title.countries.length) {
      microdata.countryOfOrigin = this.title.countries.map((c) => c.name)
    }

    if (this.title.tags.length) {
      microdata.keywords = this.title.tags.map((t) => t.toLowerCase()).join(',')
    }

    if (this.title.characters.length) {
      microdata.character = this.title.characters
    }

    if (this.title.other_names.length) {
      microdata.alternateName = this.title.other_names
    }

    if (this.title.genres.length) {
      microdata.genre = this.title.genres.map((g) => g.name)
    }

    if (parseInt(this.title.relevant_data.rating_total)) {
      microdata.aggregateRating = {
        ratingCount: this.title.relevant_data.rating_total,
        bestRating: 10,
        ratingValue: this.title.relevant_data.rating_average,
      }
    }

    if (this.title.translations.length) {
      microdata.translator = this.title.translations.map(
        (tr) => tr.translator.name
      )
    }

    if (this.title.age_rating) {
      microdata.contentRating = this.title.age_rating
    }

    if (this.isMovie(this.title.type)) {
      microdata['@type'] = 'Movie'
      if (parseInt(this.title.duration)) {
        microdata.duration = this.toDuration(parseInt(this.title.duration))
      }
    } else {
      microdata['@type'] = 'TVSeries'

      if (this.title.last_episode) {
        microdata.numberOfEpisodes = this.title.last_episode
      }
    }

    return {
      title: this.$t('meta.title.title', {
        name: this.title.name,
        ongoing: this.isOngoing(this.title.status)
          ? this.$t('meta.title.ongoing', {
              episode: this.title.last_episode,
              total_episodes: this.title.total_episodes
                ? this.$t('meta.title.total_episodes', {
                    total_episodes: this.title.total_episodes,
                  })
                : '',
            })
          : '',
      }),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.title.metas.description', {
            name: this.title.name,
            year: this.title.year,
          }),
        },
        {
          name: 'keywords',
          vmid: 'keywords',
          content: this.$t('meta.title.metas.keywords', {
            name: this.title.name,
            other: this.title.other_names.join(', '),
          }),
        },
      ],
      script: [
        {
          vmid: 'ldjson-schema',
          type: 'application/ld+json',
          json: microdata,
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.toolbar-loader::v-deep {
  .v-skeleton-loader__bone {
    width: 100%;
  }
}
</style>
