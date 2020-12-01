<template>
  <div></div>
  <!-- <Carousel> </Carousel> -->
  <!-- <v-card color="transparent" flat>
    <h2 class="heading-6 d-flex">
      <v-icon left color="primary" large>fiber_new</v-icon>
      <span>{{ $t('updates.title') }}</span>
      <v-spacer />
      <v-btn
        :text="$breakpoint.smAndUp"
        :icon="$breakpoint.xsOnly"
        class="caption"
        :to="{ name: 'updates' }"
      >
        <span class="d-none d-sm-inline">
          {{ $t('home.updates.showMore') }}
        </span>
        <v-icon small :right="$breakpoint.smAndUp">arrow_forward</v-icon>
      </v-btn>
    </h2>
    <v-toolbar>
      <v-toolbar-title>
        <v-icon left color="primary" large>fiber_new</v-icon>
        <span>{{ $t('updates.title') }}</span>
      </v-toolbar-title> 
       <v-spacer />
      <v-btn
        :text="$breakpoint.smAndUp"
        :icon="$breakpoint.xsOnly"
        class="caption"
        :to="{ name: 'updates' }"
      >
        <span class="d-none d-sm-inline">
          {{ $t('home.updates.showMore') }}
        </span>
        <v-icon small :right="$breakpoint.smAndUp">arrow_forward</v-icon>
      </v-btn>
    </v-toolbar> 
    <UpdatesList
      :episodes="episodes"
      :image-size="imageSize"
      :image-icon-size="imageIconSize"
    />
  </v-card> -->
</template>

<script lang="ts">
import { EImageSize } from '~/types/core'
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { IUpdateEpisode } from '~/types/title'
export default defineComponent({
  name: 'HomeUpdates',
  props: {
    episodes: { required: true, type: Array as () => IUpdateEpisode[] },
  },
  setup(props) {
    // const titles = computed(() => props.)
  },
})
</script>
<style scoped lang="scss">
@import '~/assets/scss/variables';
// .v-card::v-deep {
//   img {
//     border-radius: 0.2rem;
//   }
// }
</style>
