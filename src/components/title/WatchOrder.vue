<template>
  <div class="d-flex flex-column">
    <v-btn color="secondary" :small="$breakpoint.xsOnly" @click="show = !show">
      {{ show ? $t('title.watchOrder.hide') : $t('title.watchOrder.show') }}
      <v-icon :small="$breakpoint.xsOnly" :class="{ rotatez180: show }"
        >keyboard_arrow_down</v-icon
      >
    </v-btn>
    <v-slide-y-transition tag="div">
      <table v-show="show" class="mt-2">
        <tbody>
          <template v-for="(watchOrder, i) in title.watch_orders">
            <tr :key="i" class="mb-1">
              <td width="15px">{{ i + 1 }}.</td>

              <td v-if="watchOrder.title">
                <nuxt-link
                  :class="{
                    'font-weight-bold': watchOrder.title.slug == title.slug,
                  }"
                  :to="{
                    name: 'title-slug',
                    params: { slug: watchOrder.title.slug },
                  }"
                  :tag="
                    watchOrder.title.slug == title.slug ? 'span' : undefined
                  "
                >
                  <span>{{ watchOrder.title.name }}</span>
                  <span>
                    — {{ types[watchOrder.title.type] }}
                    {{ isMovie(watchOrder.title.type) ? ',' : '' }}
                  </span>
                  <span v-if="!isMovie(watchOrder.title.type)">
                    ({{
                      $t('title.watchOrder.totalEpisodes', {
                        episodes: watchOrder.title.total_episodes,
                      })
                    }}),
                  </span>
                  <span v-if="watchOrder.description">
                    {{ watchOrder.description }},
                  </span>
                  <span>{{ watchOrder.title.year }}</span>
                </nuxt-link>
              </td>
              <td v-else>
                <span>{{ watchOrder.name }}</span>
                <span>
                  — {{ types[watchOrder.type] }}
                  {{ isMovie(watchOrder.type) ? ',' : '' }}
                </span>
                <span v-if="!isMovie(watchOrder.type)">
                  ({{
                    $t('title.watchOrder.totalEpisodes', {
                      episodes: watchOrder.total_episodes,
                    })
                  }}),
                </span>
                <span v-if="watchOrder.description">
                  {{ watchOrder.description }},
                </span>
                <span>{{ watchOrder.year }}</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </v-slide-y-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import { useCommon } from '~/composables/common'

export default defineComponent({
  props: { title: { required: true, type: Object } },
  setup() {
    const { store } = useContext()
    const { isMovie } = useCommon()
    const show = ref<boolean>(false)
    const types = store.getters['config/types']
    return {
      isMovie,
      types,
      show,
    }
  },
})
</script>

<style lang="scss" scoped>
table {
  td {
    vertical-align: top;
  }
}
</style>
