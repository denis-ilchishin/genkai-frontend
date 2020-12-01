<template>
  <v-container>
    <div class="mx-5">
      <Carousel
        id="similars"
        :titles="title.similars"
        waiter="similars"
        heading="Подобное"
        :overlay="false"
      />
    </div>
  </v-container>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'TitleInfo',
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
})
</script>
