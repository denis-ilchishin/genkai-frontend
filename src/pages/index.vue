<template>
  <v-container>
    <LazyHomeLastViewedTitles
      v-if="$auth.loggedIn && viewedEpisodes && viewedEpisodes.length"
      :viewed-episodes="viewedEpisodes"
    />
    <LazyHomeCurrentSeason :titles="currentSeason" />
    <LazyHomePopulars :titles="populars" />
    <LazyHomeLatests :titles="latests" />
    <v-row>
      <v-card flat color="transparent">
        <v-card-title сlass="text-center text-md-left">
          <h1 class="heading-5">{{ $t('home.meta.title') }}</h1>
        </v-card-title>
        <v-card-text
          сlass="text-center text-md-left"
          v-html="$t('home.meta.description')"
        />
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Home',

  async asyncData({ $axios, $auth }) {
    const requests = [
      $axios.$get('/titles/current-season/'),
      $axios.$get('/titles/populars/'),
      $axios.$get('/titles/latests/'),
    ]

    if ($auth.loggedIn) {
      requests.push($axios.$get('users/last-viewed-titles/'))
    }

    const [
      currentSeason,
      populars,
      latests,
      viewedEpisodes,
    ] = await Promise.all(requests)

    return {
      currentSeason,
      populars,
      latests,
      viewedEpisodes,
    }
  },
  head() {
    return {
      title: this.$t('meta.home.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.home.metas.description'),
        },
        {
          name: 'keywords',
          vmid: 'keywords',
          content: this.$t('meta.home.metas.keywords'),
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.about-site {
  margin-bottom: -20px;
}
</style>
