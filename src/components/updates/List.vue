<template>
  <v-list :dense="$breakpoint.xsOnly" color="transparent">
    <v-list-item
      v-for="episode in episodes"
      :key="episode.id"
      :append="true"
      :to="getRoute(episode)"
      nuxt
      class="rounded my-1"
    >
      <ListItemImage>
        <BaseImage
          :image-set="episode.translation.title.poster"
          :image-size="imageSize"
          :title="episode.translation.title.name"
          :alt="episode.translation.title.name"
          :height="imageIconSize"
          class="rounded-sm"
        />
      </ListItemImage>

      <v-list-item-content v-if="$breakpoint.smAndUp">
        <v-list-item-title :title="episode.translation.title.name">
          {{ episode.translation.title.name }}
        </v-list-item-title>
        <v-list-item-subtitle
          v-if="isMovie(episode.translation.title.type)"
          class="caption"
        >
          {{ $t('updates.textMovie', getMovieTextContext(episode)) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else class="caption">
          {{ $t('updates.text', getTextContext(episode)) }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-content v-else>
        <v-list-item-title :title="episode.translation.title.name">
          {{ episode.translation.title.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ episode.translation.translator.name }}
        </v-list-item-subtitle>
        <v-list-item-subtitle
          v-if="isMovie(episode.translation.title.type)"
          class="caption"
        >
          {{ $t('updates.shortTextMovie') }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          {{ $t('updates.shortText', getTextContext(episode)) }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text>
          {{ getDateChrono(episode.date_created) }}
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import {
  defineComponent,
  useContext,
  getCurrentInstance,
} from '@nuxtjs/composition-api'
import { IUpdateEpisode, IUpdateTitle } from '~/types/title'
import { useDatetime } from '~/mixins/Datetime'
import { useCommon } from '~/composables/common'

export default defineComponent({
  props: {
    episodes: { required: true, type: Array as () => IUpdateEpisode[] },
    imageSize: { required: true, type: [String, Number] },
    imageIconSize: { required: true, type: [String, Number] },
  },
  setup(props) {
    const { store } = useContext()
    const vm = getCurrentInstance()
    const { isMovie } = useCommon()
    const { getDateChrono } = useDatetime()

    const getRoute = (updateEpisode: IUpdateEpisode) => {
      return {
        name: 'title-slug',
        params: {
          slug: updateEpisode.translation.title.slug,
          translation_id: updateEpisode.translation.id,
        },
      }
    }

    const getTextContext = (updateEpisode: IUpdateEpisode) => {
      return {
        episode:
          updateEpisode.name ||
          vm?.$t('updates.episodeNumber', { episode: updateEpisode.number }),
        translator: updateEpisode.translation.translator.name,
      }
    }

    const getMovieTextContext = (updateEpisode: IUpdateEpisode) => {
      return {
        translator: updateEpisode.translation.translator.name,
      }
    }

    return {
      isMovie,
      getDateChrono,
      getRoute,
      getTextContext,
      getMovieTextContext,
    }
  },
})
</script>
