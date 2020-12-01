<template>
  <div id="player-dialog" :class="{ minimized: isMinimized }">
    <v-bottom-sheet
      attach="#player-dialog"
      app
      :value="title"
      fullscreen
      :hide-overlay="isMinimized"
      :scrollable="isMaximized"
      persistent
      no-click-animation
    >
      <v-card
        v-if="title"
        class="player-card"
        :class="{ dragging: isDragging }"
        :flat="isMaximized"
        :tile="isMaximized"
        color="secondary"
        dark
        :elevation="isMinimized ? (isDragging ? 24 : 8) : 0"
      >
        <v-card-title class="justify-space-between flex-nowrap">
          <span
            ref="dragArea"
            class="title-name heading-6 heading-lg-5 d-inline-block text-truncate flex-grow-1"
          >
            {{ title.name }}
          </span>
          <span class="d-inline-flex flex-nowrap">
            <v-btn
              class="mr-2 mr-lg-4"
              title="Окрыть страницу сериала"
              icon
              :x-large="$breakpoint.lgAndUp"
              :disabled="isCurrentTitlePage && isMinimized"
              @click="openCurrent"
            >
              <v-icon>info</v-icon>
            </v-btn>
            <v-btn
              v-if="isMaximized"
              icon
              :x-large="$breakpoint.lgAndUp"
              class="mr-2 mr-lg-4"
              title="Свернуть плеер"
              @click="minimize"
            >
              <v-icon>fullscreen_exit</v-icon>
            </v-btn>
            <v-btn
              v-else
              icon
              :x-large="$breakpoint.lgAndUp"
              class="mr-2 mr-lg-4"
              title="Развернуть плеер"
              @click="maximize"
            >
              <v-icon>fullscreen</v-icon>
            </v-btn>
            <v-btn
              icon
              :x-large="$breakpoint.lgAndUp"
              title="Закрыть плеер"
              @click="close"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </span>
        </v-card-title>
        <v-divider v-show="isMaximized"></v-divider>
        <v-card-text class="px-4 px-lg-8 pb-0">
          <v-row>
            <v-col cols="12">
              <v-responsive
                :aspect-ratio="16 / 9"
                :max-height="playerMaxHeight"
              >
                <v-card class="h-100" flat color="transparent">
                  <template v-if="showPlaceholder">
                    <div
                      class="player__placeholder h-100 d-flex justify-center align-items-center align-center rounded-lg"
                    >
                      <v-btn
                        icon
                        x-large
                        :aria-label="$t('title.translations.playerTitle')"
                        @click="onPlaceholderPlay"
                      >
                        <v-icon x-large>play_arrow</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <template v-else>
                    <iframe
                      ref="iframeRef"
                      :src="url"
                      frameborder="0"
                      allowfullscreen
                      class="player rounded-lg"
                      :title="$t('title.translations.playerTitle')"
                      :class="{ 'd-none': isPlayerLoading }"
                      allow="autoplay *; fullscreen *"
                      @load="onIframeLoad"
                    />
                    <v-progress-circular
                      v-if="isPlayerLoading"
                      indeterminate
                      class="player-loader"
                    />
                  </template>
                </v-card>
              </v-responsive>
            </v-col>
            <v-col v-show="isMaximized" cols="12">
              <v-row>
                <v-col cols="12" :sm="hideEpisodeSelector ? 12 : 6">
                  <v-select
                    v-model="translation"
                    :items="translations"
                    hide-details
                    filled
                    rounded
                    full-width
                    return-object
                    item-value="id"
                    class="rounded-lg"
                    :label="$helpers.c($t('title.translations.translator'))"
                  >
                    <template v-slot:item="{ item }">
                      <span
                        class="d-inline-flex align-center align-items-center"
                        v-html="getTranslationText(item)"
                      />
                    </template>
                    <template v-slot:selection="{ item }">
                      <span
                        class="d-inline-flex align-center align-items-center"
                        v-html="getTranslationText(item)"
                      />
                    </template>
                  </v-select>
                </v-col>
                <v-col v-if="!hideEpisodeSelector" cols="12" sm="6">
                  <v-select
                    v-model="episode"
                    :items="episodes"
                    hide-details
                    filled
                    rounded
                    full-width
                    return-object
                    item-value="id"
                    class="rounded-lg"
                    :label="$helpers.c($t('title.translations.episode'))"
                    :disabled="!episodes.length"
                  >
                    <template v-slot:item="{ item }">
                      <span
                        class="d-inline-flex align-center align-items-center"
                        v-html="getEpisodeText(item)"
                      />
                    </template>
                    <template v-slot:selection="{ item }">
                      <span
                        class="d-inline-flex align-center align-items-center"
                        v-html="getEpisodeText(item)"
                      />
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import {
  ITitle,
  ITitleTranslation,
  ITitleTranslationEpisode,
} from '~/types/title'

import { usePlayerBase } from '~/composables/player/base'
import { usePlayerDragging } from '~/composables/player/dragging'
import { usePlayer } from '~/composables/player/player'

export default defineComponent({
  setup() {
    const { $breakpoint } = useContext()
    const iframeRef = ref<null | HTMLIFrameElement>(null)

    const playerMaxHeight = computed(() => {
      if ($breakpoint.xsOnly) {
        return 'calc(50vh - 68px)'
      } else if ($breakpoint.smOnly) {
        return 'calc(65vh - 68px)'
      } else if ($breakpoint.mdOnly) {
        return 'calc(75vh - 68px)'
      } else {
        return 'calc(85vh - 106px)'
      }
    })

    return {
      ...usePlayerBase(),
      ...usePlayerDragging(),
      ...usePlayer(iframeRef),
      iframeRef,
      playerMaxHeight,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';

.minimized::v-deep {
  .v-dialog__content {
    $width: 240px;
    $height: 60px + ($width / (16/9));
    width: $width;
    height: $height;
    .v-dialog {
      max-width: $width;
      max-height: $height;
      transition: none;
    }
  }
  .v-bottom-sheet {
    box-shadow: none !important;
  }
  .player-card {
    height: 100%;
    width: 100%;
    overflow: hidden;
    transition: all 0.15s ease-in-out;
    &.dragging {
      transform: scale(1.025);
    }
    .col,
    .row,
    .v-card__text {
      padding: 0px !important;
      margin: 0px !important;
    }
    .player__placeholder,
    .player {
      border-radius: 0 !important;
    }

    .v-card__title {
      padding: 4px 8px !important;
      .title-name {
        font-size: 0.8rem !important;
        cursor: move;
        user-select: none;
      }

      button {
        height: 28px;
        width: 28px;
        i {
          font-size: 20px;
        }
      }
    }
  }
}

.player::v-deep {
  width: 100%;
  height: 100%;
}

.player-loader ::v-deep {
  $size: 35px;
  position: absolute;
  height: $size !important;
  width: $size !important;
  top: calc(50% - #{$size/2});
  left: calc(50% - #{$size/2});
}
@media #{map-get($display-breakpoints, 'md-and-up')} {
  .player-loader ::v-deep {
    $size: 75px;
    height: $size !important;
    width: $size !important;
    top: calc(50% - #{$size/2});
    left: calc(50% - #{$size/2});
    circle {
      stroke-width: 3px;
    }
  }
}

$player-max-height: 500px;
.player__placeholder::v-deep {
  background-color: var(--v-secondary-darken1);
}

@media #{map-get($display-breakpoints, 'sm-only')} {
  .minimized::v-deep {
    .v-dialog__content {
      $width: 270px;
      $height: 28px + ($width / (16/9));
      width: $width;
      height: $height;
      .v-dialog {
        max-width: $width;
        max-height: $height;
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'md-only')} {
  .minimized::v-deep {
    .v-dialog__content {
      $width: 310px;
      $height: 28px + ($width / (16/9));
      width: $width;
      height: $height;
      .v-dialog {
        max-width: $width;
        max-height: $height;
      }
    }
  }
}
@media #{map-get($display-breakpoints, 'lg-only')} {
  .minimized::v-deep {
    .v-dialog__content {
      $width: 360px;
      $height: 28px + ($width / (16/9));
      width: $width;
      height: $height;
      .v-dialog {
        max-width: $width;
        max-height: $height;
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'xl-only')} {
  .minimized::v-deep {
    .v-dialog__content {
      $width: 460px;
      $height: 28px + ($width / (16/9));
      width: $width;
      height: $height;
      .v-dialog {
        max-width: $width;
        max-height: $height;
      }
    }
  }
}
</style>
