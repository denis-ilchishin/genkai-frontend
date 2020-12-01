<template>
  <v-list-item
    :to="{
      name: 'title-slug',
      params: { slug: title.slug },
    }"
    color="primary"
    three-line
    flat
    class="rounded flex-grow-1 pa-xs-0"
  >
    <ListItemImage>
      <BaseImage
        :image-set="title.poster"
        :image-size="imageSize"
        :title="title.name"
        :alt="title.name"
        :height="imageHeight"
        class="rounded-sm"
      />
    </ListItemImage>

    <v-list-item-content>
      <v-list-item-subtitle>
        <TitleStatusChip :title="title" x-small />
      </v-list-item-subtitle>

      <v-list-item-title class="font-weight-medium">
        {{ title.name }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ title.year }},
        {{ $helpers.c(types[title.type]) }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType, useContext } from '@nuxtjs/composition-api'
import { EImageSize } from '~/types/core'
import { IUserListTitle } from '~/types/user'

export default defineComponent({
  props: {
    title: { type: Object as PropType<IUserListTitle>, required: true },
    imageHeight: { type: [Number, String], required: true },
  },
  setup() {
    const { store } = useContext()
    const types = store.getters['config/types']
    const imageSize = EImageSize.SMALL
    const isOngoing = store.getters['config/isOngoing']

    return {
      types,
      imageSize,
      isOngoing,
    }
  },
})
</script>

<style></style>
