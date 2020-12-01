<template>
  <v-container>
    <v-flex md10 lg8 xl6 offset-md1 offset-lg2 offset-xl3>
      <v-row>
        <v-col>
          <LazyAccountCardTitle>
            {{ $t('account.profile.title') }}
          </LazyAccountCardTitle>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card flat color="transparent">
            <v-card-title class="justify-center">
              {{ $t('account.profile.image.title') }}
            </v-card-title>
            <v-card-text class="profile-image">
              <input
                id="profile-image-input"
                ref="profileImageInput"
                type="file"
                :accept="$settings.ALLOWED_IMAGE_MIME.join(',')"
                @change="onImageChange"
              />
              <div
                v-if="!newImage"
                :style="{ maxWidth: `${imageHeight}px` }"
                class="profile-image__wrapper"
              >
                <BaseImage
                  :image-set="user.profile.image"
                  :image-size="imageSize"
                  :height="imageHeight"
                  :poster="false"
                  class="rounded-lg"
                />
                <div class="d-flex flex-column align-center">
                  <v-btn
                    :disabled="$wait.is(waiters.image.remove)"
                    class="mt-2"
                    color="primary"
                    @click="onImageEdit"
                  >
                    <v-icon left>add_a_photo</v-icon>
                    {{ $helpers.c($t('account.profile.image.attachFile')) }}
                  </v-btn>
                  <v-btn
                    v-if="user.profile.image"
                    :loading="$wait.is(waiters.image.remove)"
                    text
                    color="error"
                    class="mt-2"
                    @click="onImageDelete"
                  >
                    <v-icon left>delete</v-icon>
                    {{ $helpers.c($t('account.profile.image.delete')) }}
                  </v-btn>
                </div>
              </div>

              <div v-else class="profile-new-image__wrapper text-center">
                <div class="subtitle mb-2">
                  <v-tooltip v-if="!isMobile" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>help_outline</v-icon>
                      </v-btn>
                    </template>
                    <div class="text-center" :style="{ maxWidth: '300px' }">
                      {{ $helpers.c($t('account.profile.image.help')) }}
                    </div>
                  </v-tooltip>
                  <v-tooltip v-else v-model="tooltips.image" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        v-on="on"
                        @click="tooltips.image = !tooltips.image"
                      >
                        <v-icon>help_outline</v-icon>
                      </v-btn>
                    </template>
                    <div class="text-center" :style="{ maxWidth: '300px' }">
                      {{ $helpers.c($t('account.profile.image.help')) }}
                    </div>
                  </v-tooltip>
                  {{ $helpers.c($t('account.profile.image.preview')) }}
                </div>

                <div
                  ref="imagePreview"
                  :style="previewStyles"
                  class="profile-new-image__preview mx-auto rounded-lg"
                ></div>
                <div class="pt-2">
                  <img
                    ref="imageCropper"
                    :src="newImage"
                    :style="cropperStyles"
                    class="profile-new-image__cropper"
                  />
                </div>

                <div class="d-flex flex-column align-center">
                  <v-btn
                    :loading="$wait.is(waiters.image.change)"
                    rounded
                    color="primary"
                    class="mt-2"
                    @click="onImageSubmit"
                  >
                    <v-icon left>publish</v-icon>
                    {{ $t('account.profile.image.submit') }}
                  </v-btn>

                  <v-btn
                    :disabled="$wait.is(waiters.image.change)"
                    text
                    class="mt-2"
                    @click="onImageCancel"
                  >
                    <v-icon left>clear</v-icon>
                    {{ $t('account.profile.image.cancel') }}
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card flat color="transparent">
            <v-card-title class="justify-center">
              {{ $t('account.profile.info.title') }}
            </v-card-title>
          </v-card>
        </v-col>
        <!-- <v-col cols="12" lg="6">
          <v-card>
            <v-toolbar v-bind="{ ...$settings.toolbar_attrs }">
              <v-toolbar-title>
                {{ $t('account.profile.info_title') }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="profile-info">
              <div>
                <v-select
                  v-model="data.sex"
                  :items="
                    Object.keys(sex).map((key) => ({
                      value: key,
                      text: $options.filters.c(sex[key])
                    }))
                  "
                  :label="$helpers.c($t('account.profile.sex'))"
                  hide-details
                  rounded
                  filled
                  clearable
                  @change="onChange"
                />
              </div>
              <div>
                <v-menu
                  v-model="birthdayMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="data.birthday"
                      :label="$helpers.c($t('account.profile.birthday'))"
                      hide-details
                      rounded
                      filled
                      readonly
                      clearable
                      @change="onChange"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="birthdayPicker"
                    v-model="data.birthday"
                    color="primary"
                    first-day-of-week="1"
                    max="2009-12-31"
                    @input="birthdayMenu = false"
                    @change="onChange"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div>
                <v-textarea
                  v-model="data.about_myself"
                  :counter="aboutMyselfMaxLength"
                  :label="$helpers.c($t('account.profile.aboutMyself'))"
                  :error="
                    $v.data.about_myself.$invalid && $v.data.about_myself.$dirty
                  "
                  :error-messages="
                    errorMessage(
                      $v.data.about_myself,
                      $t('default.inputs.errors')
                    )
                  "
                  rounded
                  filled
                  @change="onChange"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col> -->
      </v-row>
    </v-flex>
  </v-container>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { mapGetters } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
import { EImageSize } from '~/types/core'

export default {
  middleware: ['user'],

  data() {
    return {
      waiters: {
        image: {
          change: 'profile.image.change',
          remove: 'profile.image.remove',
        },
      },
      newImage: null,
      cropper: null,
      tooltips: {
        image: false,
      },
      data: {
        birthday: null,
        sex: null,
        about_myself: '',
      },
      aboutMyselfMaxLength: this.$store.getters['config/input'](
        'account.profile.about_myself.max_length',
        255
      ),
      birthdayMenu: false,
      updateTimeout: null,
    }
  },
  computed: {
    ...mapGetters(['isMobile']),
    ...mapGetters('config', ['sex']),
    user() {
      return this.$auth.user
    },
    imageSize() {
      return EImageSize.MEDUIM
    },
    imageHeight() {
      return 300
    },
    previewStyles() {
      return {
        height: `${this.imageHeight}px`,
        overflow: 'hidden',
      }
    },
    cropperStyles() {
      return {
        maxWidth: `${this.imageHeight}px`,
        maxHeight: `${this.imageHeight}px`,
        width: '100%',
      }
    },
  },
  watch: {
    birthdayMenu(val) {
      val && setTimeout(() => (this.$refs.birthdayPicker.activePicker = 'YEAR'))
    },
  },
  created() {
    this.data.birthday = this.user.profile.birthday
    this.data.about_myself = this.user.profile.about_myself
    this.data.sex = this.user.profile.sex
  },
  methods: {
    resetNewImage() {
      this.newImage = null
      if (this.cropper) {
        this.cropper.destroy()
        this.cropper = null
      }

      if (this.$refs.profileImageInput) {
        this.$refs.profileImageInput.value = ''
      }
    },
    onImageEdit() {
      if (this.$refs.profileImageInput) this.$refs.profileImageInput.click()
    },
    onImageChange(e) {
      const file = (e.target.files || e.dataTransfer.files)[0]

      if (!file) {
        this.resetNewImage()
        return
      }

      if (!this.$settings.ALLOWED_IMAGE_MIME.includes(file.type)) {
        this.$snack.error(this.$t('account.profile.image.notAllowedType'))
        return
      }

      this.newImage = URL.createObjectURL(file)

      setTimeout(() => {
        this.cropper = new Cropper(this.$refs.imageCropper, {
          aspectRatio: 1,
          initialAspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          preview: this.$refs.imagePreview,
          rotatable: false,
          scalable: false,
          minCropBoxWidth: 50,
        })
      })
    },
    onImageCancel() {
      this.resetNewImage()
    },
    onImageDelete() {
      this.$store.dispatch('wait/start', this.waiters.image.remove)
      this.$store
        .dispatch('user/removeImage')
        .then(() => {
          this.resetNewImage()
          this.$snack(this.$t('success.profile.image.remove'))
        })
        .catch(() => {})
        .finally(() => {
          this.$store.dispatch('wait/end', this.waiters.image.remove)
        })
    },
    onImageSubmit() {
      this.$store.dispatch('wait/start', this.waiters.image.change)
      this.cropper.getCroppedCanvas().toBlob(
        (blob) => {
          this.$store
            .dispatch('user/changeImage', blob)
            .then(() => {
              this.resetNewImage()
              this.$snack(this.$t('success.profile.image.change'))
            })
            .catch(() => {})
            .finally(() => {
              this.$store.dispatch('wait/end', this.waiters.image.change)
            })
        },
        'image/webp',
        1 // quality - set maximum = 1, all optimizations we will do on server side
      )
    },
    onChange() {
      const updateData = {}

      for (const name of Object.keys(this.$v.data).filter(
        (k) => !k.startsWith('$')
      )) {
        if (Object.prototype.hasOwnProperty.call(this.$v.data, name)) {
          const validate = this.$v.data[name]
          if (!validate.$invalid) {
            const value = validate.$model === undefined ? null : validate.$model

            updateData[name] = value
          }
        }
      }

      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout)
      }

      this.updateTimeout = setTimeout(() => {
        this.$store
          .dispatch('user/updateUserData', {
            id: this.user.id,
            data: updateData,
          })
          .then(() => {})
          .catch(() => {})
      }, 1000)
    },
  },
  validations() {
    return {
      data: {
        birthday: {},
        sex: {},
        about_myself: {
          maxLength: maxLength(this.aboutMyselfMaxLength),
        },
      },
    }
  },
  head() {
    return {
      title: this.$t('meta.accountProfile.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.accountProfile.metas.description'),
        },
        {
          name: 'robots',
          vmid: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';

.profile::v-deep {
  .cropper-bg {
    background-repeat: repeat;
  }
}
#profile-image-input {
  display: none;
}

.profile-image__wrapper::v-deep {
  position: relative;
  margin: 0 auto;

  .profile-image__hover {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  picture,
  img {
    width: 100%;
  }
}
.profile-new-image__preview {
  background-color: black;
}

$hover-alpha: 0.65;

.profile-image__wrapper {
  .profile-image__hover {
    background-color: rgba(map-get($shades, 'black'), $hover-alpha);
  }
}

.profile-info {
  .v-input {
    margin: 0.25rem;
  }
  table {
    tr {
      td:first-child {
        padding-right: 1rem;
      }
    }
  }
}
</style>
