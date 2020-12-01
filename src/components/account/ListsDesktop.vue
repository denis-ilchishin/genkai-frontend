<template>
  <v-tabs
    :vertical="$breakpoint.mdAndUp"
    :centered="$breakpoint.smAndDown"
    show-arrows
  >
    <template v-for="list in $auth.user.lists">
      <v-tab :key="list.id" class="justify-start">
        <span>{{ list.name }}</span>
        <v-spacer></v-spacer>
        <span v-if="list.list_titles.length" class="number ml-4">
          ({{ list.list_titles.length }})
        </span>
      </v-tab>
      <v-tab-item :key="`tab-${list.id}`">
        <v-card flat>
          <v-list v-if="list.list_titles.length">
            <AccountListsTitle
              v-for="list_title in list.list_titles"
              :key="list_title.id"
              :title="list_title.title"
              :image-height="imageHeight"
            />
          </v-list>
          <div v-else class="text-center pt-4">
            {{ $t('account.lists.noRecords') }}
          </div>
        </v-card>
      </v-tab-item>
    </template>
  </v-tabs>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import { EImageSize } from '~/types/core'
export default defineComponent({
  setup() {
    const imageHeight = 50
    return {
      imageHeight,
    }
  },
})
</script>

<style></style>
