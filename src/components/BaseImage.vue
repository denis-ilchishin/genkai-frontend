<template>
  <picture
    :class="{ poster }"
    :style="height ? `--height: ${parseFloat(height)}px;` : ''"
  >
    <source
      v-for="(source, i) in sources"
      :key="i"
      :srcset="source.srcset"
      :type="`image/${source.type}`"
      :media="source.media"
    />
    <v-fade-transition>
      <span v-if="imageSet && isLoading" class="loader">
        <v-skeleton-loader type="image" height="100%" width="100%" />
      </span>
      <img
        v-else-if="!imageSet || isFailed"
        :src="placeholder"
        :style="{ ...styles }"
        v-bind="$attrs"
      />
    </v-fade-transition>
    <img
      v-if="imageSet && !isFailed"
      v-bind="$attrs"
      :src="defaultSrc"
      :style="{ ...styles }"
      loading="lazy"
      @load="onLoaded"
      @error="onError"
    />
  </picture>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  computed,
  ref,
  Ref,
  onMounted,
} from '@nuxtjs/composition-api'
import {
  BreakpointThresholds,
  BreakpointName,
} from 'vuetify/types/services/breakpoint'
import {
  ImageSizeProp,
  EImageFormat,
  EImageQuality,
  EImageSize,
  ObjectType,
  ImageSet,
} from '~/types/core'
import { helpers, required } from 'vuelidate/lib/validators'

import PlaceholdeDefault from '~/assets/images/placeholder.jpg'
import PlaceholdePoster from '~/assets/images/placeholder-poster.jpg'

export default defineComponent({
  props: {
    imageSet: { required: true },
    imageSize: {
      type: [Object as () => ImageSizeProp, String as () => ImageSizeProp],
      required: true,
    },
    height: {
      type: [Number, String],
      required: true,
    },
    flickity: {
      type: Boolean,
      required: false,
    },
    poster: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { $settings, $vuetify, $helpers } = useContext()
    const imageSet = props.imageSet as ImageSet
    const imageSize = props.imageSize
    const placeholder = props.poster ? PlaceholdePoster : PlaceholdeDefault
    const breakpoints = $vuetify.breakpoint.thresholds
    const sources = computed(() => {
      if (!imageSet || isFailed.value) {
        return []
      }
      type Source = { srcset: string; type: EImageFormat; media: string }
      const result: Source[] = []
      for (const format of Object.values(EImageFormat)) {
        if (imageSize instanceof Object) {
          for (const breakpoint in imageSize) {
            const size = imageSize[breakpoint as never]
            if (breakpoint === 'xl') {
              const width = $vuetify.breakpoint.thresholds.lg
              const srcSet: string[] = []
              for (const quality of Object.values(EImageQuality)) {
                srcSet.push(`${imageSet[format][quality][size]} ${quality}`)
              }
              result.push({
                srcset: srcSet.join(', '),
                media: `(min-width: ${width}px)`,
                type: format,
              })
            } else {
              const width = $helpers.getNextLowest(
                Object.values(breakpoints),
                breakpoints[breakpoint as never],
                1
              )
              const srcSet: string[] = []
              for (const quality of Object.values(EImageQuality)) {
                srcSet.push(`${imageSet[format][quality][size]} ${quality}`)
              }
              result.push({
                srcset: srcSet.join(', '),
                media: `(min-width: ${width ?? 0}px)`,
                type: format,
              })

              const parseWidth = (source: Source) => {
                return parseInt(source.media.replace(/\D/g, ''))
              }

              result.sort((a, b) => parseWidth(b) - parseWidth(a))
            }
          }
        } else {
          const srcSet: string[] = []

          for (const quality of Object.values(EImageQuality)) {
            srcSet.push(`${imageSet[format][quality][imageSize]} ${quality}`)
          }

          result.push({
            srcset: srcSet.join(', '),
            media: `(min-width: 0px)`,
            type: format,
          })
        }
      }
      return result
    })

    const defaultSrc = imageSet ? `${imageSet.jpeg['2x'].big}` : ''

    const hasHeight = ref(typeof props.height !== 'undefined')
    const hasWidth = ref(typeof props.height !== 'undefined')
    const hasHeightAndWidth = ref(hasHeight.value && hasWidth.value)

    const parseNumber = (value: string | number): number => {
      if (typeof value === 'number') {
        return value
      } else {
        return parseFloat(value)
      }
    }

    const styles = computed(() => {
      const result: ObjectType = {}
      if (props.height) {
        result.height = `${parseNumber(props.height)}px`
      }
      return result
    })

    const isLoading: Ref<boolean> = ref(true)
    const isFailed = ref(false)

    const onLoaded = (event: Event) => {
      isLoading.value = false
    }

    const onError = (event: Event) => {
      isLoading.value = false
      isFailed.value = true
    }

    const progressSize = computed(() => parseNumber(props.height) / 3)
    const progressWidth = computed(() => progressSize.value / 12)

    return {
      sources,
      defaultSrc,
      hasHeight,
      hasWidth,
      hasHeightAndWidth,
      styles,
      placeholder,
      isLoading,
      isFailed,
      onLoaded,
      onError,
      progressSize,
      progressWidth,
    }
  },
})
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
.loader::v-deep {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

picture::v-deep {
  position: relative;
  display: flex;
  img {
    width: auto;
    height: 100%;
    border-radius: inherit;
    font-size: 10px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  height: var(--height);
  width: var(--height);

  &.poster {
    width: calc(var(--height) * #{$poster-ratio-width});
  }
}
</style>
