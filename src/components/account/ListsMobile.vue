<template>
  <v-tabs :value="selectedList ? 1 : 0" vertical>
    <v-tab-item>
      <v-list>
        <v-list-item
          v-for="list in $auth.user.lists"
          :key="list.id"
          link
          class="rounded"
          @click="selectList(list)"
        >
          <span>{{ list.name }}</span>
          <v-spacer></v-spacer>
          <span v-if="list.list_titles.length" class="number">
            ({{ list.list_titles.length }})
          </span>
        </v-list-item>
      </v-list>
    </v-tab-item>
    <v-tab-item>
      <v-slide-x-transition>
        <v-list v-if="selectedList && selectedList.list_titles.length">
          <div
            class="mb-2 d-flex justify-center align-items-center align-center"
          >
            <v-btn icon large absolute left @click="resetList">
              <v-icon>keyboard_backspace</v-icon>
            </v-btn>
            <span class="heading-6 text-center ml-4">
              {{ selectedList.name }}
            </span>
          </div>
          <AccountListsTitle
            v-for="list_title in selectedList.list_titles"
            :key="list_title.id"
            :title="list_title.title"
            :image-height="imageHeight"
          />
        </v-list>
        <div
          v-else-if="selectedList && !selectedList.list_titles.length"
          class="text-center pt-4"
        >
          {{ $t('account.lists.noRecords') }}
        </div>
      </v-slide-x-transition>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import { EImageSize } from '~/types/core'
import { IUserList } from '~/types/user'

export default defineComponent({
  setup() {
    const { store, $auth, $toast } = useContext()
    const imageHeight = 40
    const types = store.getters['config/types']

    const selectedList = ref(null as IUserList | null)

    const selectList = (list: IUserList) => {
      if (list.list_titles.length) {
        selectedList.value = list
      } else {
        $toast.default('Список пуст', { queue: false })
      }
    }

    const resetList = () => {
      selectedList.value = null
    }

    return {
      imageHeight,
      types,
      selectedList,
      selectList,
      resetList,
    }
  },
})
</script>

<style></style>
