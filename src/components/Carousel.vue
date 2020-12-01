<template>
  <v-row class="py-4">
    <v-col cols="12" class="py-0">
      <div class="d-flex align-items-center align-center">
        <h2 class="heading-6 heading-lg-5 titled-border">
          <v-icon v-if="icon" :large="$breakpoint.lgAndUp" left color="primary">
            {{ icon }}
          </v-icon>
          <span>{{ heading }}</span>
          <slot name="heading-extend" />
        </h2>
        <v-spacer></v-spacer>
        <div v-if="!isMobile">
          <v-btn icon @click="onPrevious">
            <v-icon>keyboard_arrow_left</v-icon>
          </v-btn>
          <v-btn icon @click="onNext">
            <v-icon>keyboard_arrow_right</v-icon>
          </v-btn>
        </div>
        <v-btn v-if="to" :to="to" text small class="rounded ml-4">
          {{ $t('home.carousel.showAll') }}
          <v-icon right>arrow_forward</v-icon>
        </v-btn>
      </div>
    </v-col>
    <v-col cols="12">
      <div ref="carouselWrapperRef" class="carousel">
        <Flickity :options="flickityOptions" @init="onFlickityInit">
          <v-card
            v-for="title in titles"
            :key="title.slug"
            rounded
            nuxt
            :to="
              asRoute
                ? { name: 'title-slug', params: { slug: title.slug } }
                : undefined
            "
            class="d-flex flex-column mx-3"
            color="transparent"
            flat
            @click="asRoute ? undefined : $emit('click', title)"
          >
            <v-lazy tag="span">
              <span class="title-image">
                <BaseImage
                  :image-set="title.poster"
                  :image-size="imageSize"
                  :title="title.name"
                  :alt="title.name"
                  :height="isMobile ? 225 : 250"
                  flickity
                  class="rounded"
                />

                <span v-if="overlay" class="title-image-hover"></span>
                <slot name="caption" :title="title" />
              </span>
            </v-lazy>
            <span
              class="d-inline-block title-name body-1 text-truncate font-weight-medium"
              :title="title.name"
            >
              {{ title.name }}
            </span>
          </v-card>
        </Flickity>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  ref,
  computed,
  onMounted,
  PropType,
} from '@nuxtjs/composition-api'
import { IBaseTitle, EImageSize } from '~/types/core'
import { required } from 'vuelidate/lib/validators'

import { Location } from 'vue-router'
// @ts-ignore
export default defineComponent({
  props: {
    titles: {
      type: Array as PropType<IBaseTitle[]>,
      required: true,
    },
    waiter: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    asRoute: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      required: false,
    },
    options: {
      type: Object as PropType<Flickity.Options>,
      required: false,
      default: () => ({
        // autoPlay: 5000,
        pageDots: false,
        resize: true,
        prevNextButtons: false,
        freeScroll: true,
        cellAlign: 'left',
        contain: true,
        lazyLoad: true,
      }),
    },
    to: {
      type: Object as PropType<Location>,
    },
  },

  setup(props) {
    const { store, $helpers, $wait } = useContext()
    const carouselWrapperRef = ref(null as null | HTMLElement)
    const isMobile = store.getters.isMobile
    let flickity = null as null | Flickity
    const isLoading = computed(() => $wait.is(props.waiter))
    const imageSize = EImageSize.MEDUIM
    const flickityOptions = {
      on: {
        dragStart: () => {
          carouselWrapperRef.value?.classList.add('is-dragging')
        },
        dragEnd: () => {
          carouselWrapperRef.value?.classList.remove('is-dragging')
        },
      },
      ...props.options,
    }

    $wait.start(props.waiter)

    onMounted(() => {
      $wait.end(props.waiter)
    })

    const onFlickityInit = (instance: Flickity) => {
      flickity = instance
    }
    const onPrevious = () => {
      flickity?.previous()
    }
    const onNext = () => {
      flickity?.next()
    }

    return {
      carouselWrapperRef,
      isLoading,
      onFlickityInit,
      onPrevious,
      onNext,
      isMobile,
      imageSize,
      flickityOptions,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
$offset: 10px;
$title-name-height: 20px;
$title-name-margin-top: 8px;
$scale: scale(1.03);
$caption-height: $title-name-height + $title-name-margin-top;
$transition: all 0.2s ease-in-out;
$opacity: 0.935;

.carousel::v-deep {
  $height: 250px;
  width: calc(100% + #{$offset * 2});
  height: $height + ($offset * 2) + $caption-height;
  padding: $offset;
  margin: -$offset;
  overflow: hidden;

  .flickity-enabled {
    outline: none;
  }
  .flickity-viewport {
    overflow: unset;
  }

  .v-card {
    height: $height + $caption-height;
    width: $height * $poster-ratio-width;
    &.v-card--link:focus:before {
      opacity: 0 !important;
    }

    img {
      height: $height;
    }

    .title-name {
      margin-top: $carousel-caption-offset;
    }

    .title-image {
      display: block;
      position: relative;
      span {
        border-radius: map-deep-get($rounded, 'sm');
        font-family: map-deep-get($headings, 'body-2', 'font-family');
        font-weight: map-deep-get($headings, 'body-2', 'weight');
        font-size: map-deep-get($headings, 'body-2', 'size');
        letter-spacing: map-deep-get($headings, 'body-2', 'letter-spacing');
        line-height: map-deep-get($headings, 'body-2', 'line-height');
      }
    }

    .title-image > {
      .carousel-caption-inline,
      .carousel-caption-block {
        transition: $transition;
        position: absolute;
        width: auto;
        left: $carousel-caption-offset;
        background-color: $carousel-caption-color;
        opacity: 0;
        padding: $carousel-caption-offset;
        box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.75);
      }
    }
    .title-image > .carousel-caption-block {
      left: 0;
      max-width: calc(100% - #{$carousel-caption-offset * 2});
      margin-left: $carousel-caption-offset;
      margin-right: $carousel-caption-offset;
      display: inline-block;
    }

    .title-image {
      picture,
      img {
        transition: $transition;
      }
    }

    .title-image {
      .title-image-hover {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.35);
        opacity: 0;
        transition: $transition;
      }
    }
    & {
      .title-image > * {
        transition: $transition;
      }
    }

    &:hover,
    &:active,
    &:focus {
      .title-image > * {
        transform: $scale;
        opacity: 1;
        transition: $transition;
      }
    }
  }

  &.is-dragging {
    .v-card {
      pointer-events: none;
    }
  }
}
.is-mobile {
  .carousel::v-deep {
    $height: 225px;
    height: $height + ($carousel-caption-offset * 2) + $caption-height;

    .v-card {
      height: $height + $caption-height;
      width: $height * $poster-ratio-width;

      img {
        height: $height;
      }
      .title-image > {
        .carousel-caption-inline,
        .carousel-caption-block {
          opacity: $opacity - 0.05;
          background-color: $carousel-caption-color;
        }
      }

      .title-image {
        .title-image-hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      &:hover,
      &:active,
      &:focus {
        .title-image > * {
          transform: none;
        }
      }
    }
  }
}
</style>
