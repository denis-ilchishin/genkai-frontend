<template>
  <div>
    <v-container fluid class="pb-0">
      <v-row>
        <v-container class="pb-0">
          <v-flex md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3>
            <v-row>
              <v-col cols="12" class="d-flex">
                <h1 class="heading-4 mx-auto titled-border">
                  {{ $t('updates.title') }}
                </h1>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-card flat color="transparent">
                  <v-card-text class="text-center">
                    {{ $t('updates.meta.description') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-flex>
        </v-container>
      </v-row>
    </v-container>
    <v-container>
      <v-flex md10 offset-md1 lg8 offset-lg2 xl6 offset-xl3>
        <v-row>
          <v-col cols="12">
            <v-card flat tile color="transparent">
              <UpdatesList
                :episodes="episodes"
                :image-size="imageSize"
                :image-icon-size="imageHeight"
              />
              <client-only>
                <InfiniteLoader
                  :identifier="identifier"
                  :is-loading="isLoading"
                  @infinite="onNext"
                />
              </client-only>
            </v-card>
          </v-col>
        </v-row>
      </v-flex>
    </v-container>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  ref,
  useAsync,
  Ref,
  computed,
  getCurrentInstance,
  useMeta,
  ComputedRef,
} from '@nuxtjs/composition-api'
import { EImageSize } from '~/types/core'
import { IUpdateEpisode, IUpdateTitle } from '~/types/title'
import { MetaInfo } from 'vue-meta/types/vue-meta'

export default defineComponent({
  setup() {
    const { $wait, $axios } = useContext()
    const vm = getCurrentInstance()

    const limit = 20

    type FetchedData = {
      results: IUpdateEpisode[]
      next: null | string
    }

    const fetchData = useAsync<FetchedData>(
      async () =>
        await $axios.$get('translations/updates/', { params: { limit } })
    )

    const episodes = computed(() =>
      fetchData.value ? fetchData.value.results : []
    )
    const nextPage = computed(() =>
      fetchData.value ? fetchData.value.next : null
    )

    const waiter = 'updates.nextPage'
    const imageSize = EImageSize.SMALL
    const imageHeight = 50
    const isLoading: ComputedRef<boolean> = computed(() => $wait.is(waiter))
    const identifier = computed(() =>
      fetchData.value ? fetchData.value.results.length : -1
    )

    useMeta({
      title: vm?.$t('meta.updates.title') as string,
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: vm?.$t('meta.updates.metas.description') as string,
        },
        {
          name: 'keywords',
          vmid: 'keywords',
          content: vm?.$t('meta.updates.metas.keywords') as string,
        },
      ],
    })

    const onNext = () => {
      if (nextPage.value) {
        $wait.start(waiter)
        $axios
          .$get(nextPage.value, { progress: false })
          .then(({ results, next }: FetchedData) => {
            fetchData.value?.results.push(...results)
            // @ts-ignore
            fetchData.value?.next = next
          })
          .finally(() => {
            $wait.end(waiter)
          })
      }
    }

    return {
      imageSize,
      imageHeight,
      isLoading,
      onNext,
      episodes,
      identifier,
    }
  },
  head: {},
})
</script>
