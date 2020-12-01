<template>
  <NavigationMenu
    :show="isShowingSearchMenu"
    :title="$t('nav.search')"
    :style="styles"
    code="search"
    @close="closeSearchMenu"
  >
    <template v-slot:extend>
      <v-container>
        <v-flex lg10 offset-lg1 xl8 offset-xl2>
          <v-row>
            <v-col>
              <form novalidate @submit.prevent="search(false)">
                <v-text-field
                  ref="searchInputRef"
                  v-model.trim="searchQuery"
                  :label="$t('search.label')"
                  :hint="$t('search.hint')"
                  :error="$v.searchQuery.$invalid && $v.searchQuery.$dirty"
                  :error-messages="
                    getInputErrorMessage(
                      $v.searchQuery,
                      $t('search.errors'),
                      true
                    )
                  "
                  :counter="maxLength"
                  :disabled="isLoading"
                  filled
                  persistent-hint
                  signle-line
                  clearable
                  rounded
                  class="rounded-lg"
                  @blur="$v.searchQuery.$model && $v.searchQuery.$touch()"
                  @input="search()"
                  @change="search()"
                />
              </form>
            </v-col>
          </v-row>
        </v-flex>
      </v-container>
      <v-divider></v-divider>
    </template>
    <v-container>
      <v-flex lg10 offset-lg1 xl8 offset-xl2>
        <v-row>
          <v-col>
            <v-fade-transition mode="out-in">
              <v-list v-if="loaded && titles.length" color="transparent" dark>
                <v-list-item
                  v-for="title in titles"
                  :key="title.slug"
                  :to="{ name: 'title-slug', params: { slug: title.slug } }"
                  nuxt
                  color="primary"
                  @click="
                    onTitleClick(
                      $router.resolve({
                        name: 'title-slug',
                        params: { slug: title.slug },
                      }).route
                    )
                  "
                >
                  <ListItemImage>
                    <BaseImage
                      :image-set="title.poster"
                      :image-size="imageSize"
                      :title="title.name"
                      :alt="title.name"
                      :height="imageHeight"
                      class="rounded"
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
                      <span class="number">{{ title.year }}</span>
                      ,
                      {{ $helpers.c(types[title.type]) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div v-else-if="isLoading" class="d-flex justify-center">
                <v-progress-circular color="primary" indeterminate />
              </div>
              <p v-else-if="loaded" class="text-center body-1">
                {{ $helpers.c($t('search.noResults')) }}
              </p>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-flex>
    </v-container>
  </NavigationMenu>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import {
  defineComponent,
  useContext,
  ref,
  reactive,
  computed,
  watch,
  getCurrentInstance,
} from '@nuxtjs/composition-api'
import { Route } from 'vue-router/types/router'
import { useVuelidateInputMessages } from '~/mixins/VuelidateInputMessages'
import { useSearchMenu } from '~/mixins/SearchMenu'
import { ImageSizeProp, ObjectType, EImageSize } from '~/types/core'

export default defineComponent({
  setup(props, { root: { $route } }) {
    const {
      store,
      $breakpoint,
      $vuetify,
      $settings,
      $wait,
      $axios,
    } = useContext()
    const vm = getCurrentInstance()

    const { isShowingSearchMenu, closeSearchMenu } = useSearchMenu()
    const { getInputErrorMessage } = useVuelidateInputMessages()

    // Template refs
    const searchInputRef = ref(null as null | HTMLElement)

    // Input validation data
    const maxLength = store.getters['config/input'](
      'titles.search.max_length',
      2
    )
    const minLength = store.getters['config/input'](
      'titles.search.min_length',
      50
    )

    // Title types
    const types = store.getters['config/types']

    const imageHeight = computed(() => ($breakpoint.xsOnly ? 50 : 75))
    const imageSize: ImageSizeProp = {
      xs: EImageSize.SMALL,
      sm: EImageSize.MEDUIM,
    }

    // Image inline styles
    const styles = computed(() => {
      const result: ObjectType = {}

      if ($breakpoint.lgAndUp) {
        result.left = $vuetify.application.left
      } else if ($breakpoint.smAndUp) {
        result.left = $settings.SIDENAV_MINI_WIDTH
      }

      if (result.left) {
        result.width = `calc(100% - ${result.left}px)`
      }
      return result
    })

    // Search request impl
    const searchQuery = ref('')
    const lastSearchQuery = ref(null as null | string)

    let searchTimeout: null | NodeJS.Timeout = null
    const timeoutTime = 1500 // * no-reactive

    const titles = ref([])
    const loaded = ref(false)

    const waiter = 'search.fetch' // * no-reactive
    const isLoading = computed(() => $wait.is(waiter))

    const clearSearchTimeout = () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }

    const isSearchQueryDifferent = () => {
      return lastSearchQuery.value !== searchQuery.value
    }

    const search = (timeout: boolean = true) => {
      if (vm) {
        if (!searchQuery.value) {
          vm.$v.$reset()
          loaded.value = false
          clearSearchTimeout()
          return
        }

        clearSearchTimeout()

        if (!isSearchQueryDifferent()) {
          // Do not send new search request if search query equals to previous one
          loaded.value = true
        } else if (!loaded || isSearchQueryDifferent()) {
          // Do not send new search request if search query equals to previous one
          const _searchQuery = searchQuery.value

          searchTimeout = setTimeout(
            () => {
              vm.$v.$touch()
              if (!vm.$v.$invalid) {
                $wait.start(waiter)
                lastSearchQuery.value = _searchQuery
                $axios
                  .get('titles/search/', {
                    params: { q: _searchQuery },
                    progress: false,
                  })
                  .then(({ data }) => {
                    titles.value = data
                    loaded.value = true
                    searchInputRef.value?.blur()
                  })
                  .finally(() => {
                    $wait.end(waiter)
                  })
              }
            },
            timeout ? timeoutTime : 0
          )
        }
      }
    }

    const onTitleClick = (route: Route) => {
      if (vm?.$route.path === route.path) {
        closeSearchMenu()
      }
    }

    // Autofocus on input after opening search menu
    watch(isShowingSearchMenu, (showing: boolean) => {
      if (showing && searchInputRef.value) {
        setTimeout(() => {
          searchInputRef.value?.focus()
        }, 100)
      }
    })

    watch(
      () => vm?.$route,
      () => {
        closeSearchMenu()
      }
    )

    return {
      maxLength,
      minLength,
      titles,
      searchQuery,
      loaded,
      types,
      searchInputRef,
      imageHeight,
      imageSize,
      styles,
      search,
      onTitleClick,
      getInputErrorMessage,
      isLoading,
      closeSearchMenu,
      isShowingSearchMenu,
    }
  },

  validations() {
    return {
      searchQuery: {
        required,
        // @ts-ignore
        minLength: minLength(this.minLength),
        // @ts-ignore
        maxLength: maxLength(this.maxLength),
      },
    }
  },
})
</script>
