<template>
  <v-flex sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
    <form @submit.prevent="onSubmit">
      <v-stepper v-model="currentStep" alt-labels color="transparent">
        <v-card-title class="display-1 justify-center text-center">
          {{ $t('register.steps.title') }}
        </v-card-title>
        <v-stepper-header>
          <template v-for="(step, i) in steps">
            <v-stepper-step
              :key="i"
              :complete="currentStep > i + 1"
              :step="i + 1"
            >
              <v-icon :color="currentStep > i ? 'primary' : ''">{{
                step.icon
              }}</v-icon>
            </v-stepper-step>
            <v-divider v-if="i + 1 < steps.length" :key="`d_${i}`"></v-divider>
          </template>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content :step="getStepIndex('email')">
            <v-card flat>
              <v-text-field
                v-model.trim="data.email"
                :label="$t('register.fields.email.label')"
                :error="$v.data.email.$error"
                :error-messages="
                  getInputErrorMessage(
                    $v.data.email,
                    $t('register.fields.email.errors')
                  )
                "
                filled
                rounded
                class="rounded-lg"
              />
              <v-card-actions>
                <v-btn
                  text
                  color="primary"
                  class="mt-2 mt-sm-0"
                  :to="{ name: 'login' }"
                  :small="$breakpoint.xsOnly"
                >
                  {{ $t('register.steps.singin') }}
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="$wait.is(waiter.next)"
                >
                  {{ $t('register.steps.next') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content :step="getStepIndex('username')">
            <v-card flat>
              <v-text-field
                v-model.trim="data.username"
                :label="$t('register.fields.username.label')"
                :error="$v.data.username.$error"
                :error-messages="
                  getInputErrorMessage(
                    $v.data.username,
                    $t('register.fields.username.errors')
                  )
                "
                filled
                rounded
                class="rounded-lg"
              />
              <v-card-actions>
                <v-btn
                  text
                  :small="$breakpoint.xsOnly"
                  class="mt-2 mt-sm-0"
                  @click="previosStep"
                >
                  {{ $t('register.steps.back') }}
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="$wait.is(waiter.next)"
                >
                  {{ $t('register.steps.next') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content :step="getStepIndex('password')">
            <v-card flat>
              <v-text-field
                v-model.trim="data.password"
                type="password"
                :label="$t('register.fields.password.label')"
                :error="$v.data.password.$error"
                :error-messages="
                  getInputErrorMessage(
                    $v.data.password,
                    $t('register.fields.password.errors')
                  )
                "
                filled
                rounded
                class="rounded-lg"
              />
              <v-text-field
                v-model.trim="data.password_confirmation"
                type="password"
                :label="$t('register.fields.passwordConfirmation.label')"
                :error="$v.data.password_confirmation.$error"
                :error-messages="
                  getInputErrorMessage(
                    $v.data.password_confirmation,
                    $t('register.fields.passwordConfirmation.errors')
                  )
                "
                filled
                rounded
                class="rounded-lg"
              />
              <v-card-actions>
                <v-btn
                  text
                  :small="$breakpoint.xsOnly"
                  class="mt-2 mt-sm-0"
                  @click="previosStep"
                >
                  {{ $t('register.steps.back') }}
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="$wait.is(waiter.submit)"
                >
                  {{ $t('register.steps.submit') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </form>
  </v-flex>
</template>

<script>
import {
  required,
  maxLength,
  email,
  sameAs,
  minLength,
} from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { useCommon } from '~/composables/common'
import { useVuelidateInputMessages } from '~/mixins/VuelidateInputMessages'
import { username } from '~/validators'
export default {
  middleware: 'guest',
  setup() {
    const { getInputErrorMessage } = useVuelidateInputMessages()
    return { getInputErrorMessage }
  },
  data() {
    return {
      actionClasses:
        'flex-column-reverse justify-center flex-sm-row justify-sm-space-between',
      waiter: {
        next: 'register.next',
        submit: 'register.submit',
      },
      showPassword: false,
      data: {
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
      },
      isAvaliable: {
        email: true,
        username: true,
      },
      currentStep: 1,
      steps: [
        {
          value: 'email',
          icon: 'email',
          submit: async () => {
            this.$v.data.email.$touch()

            if (this.$v.data.email.$invalid) {
              return Promise.reject(new Error('Not valid'))
            }

            await this.$axios
              .post(
                'users/is_email_available/',
                {
                  email: this.data.email,
                },
                { progress: false }
              )
              .then(({ data: { result } }) => {
                if (result) {
                  return Promise.resolve()
                } else {
                  this.isAvaliable.email = false
                  return Promise.reject(new Error('Not valid'))
                }
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          },
        },
        {
          value: 'username',
          icon: 'assignment_ind',
          submit: async () => {
            this.$v.data.username.$touch()

            if (this.$v.data.username.$invalid) {
              return Promise.reject(new Error('Not valid'))
            }

            await this.$axios
              .post(
                'users/is_username_available/',
                {
                  username: this.data.username,
                },
                { progress: false }
              )
              .then(({ data: { result } }) => {
                if (result) {
                  return Promise.resolve()
                } else {
                  this.isAvaliable.username = false
                  return Promise.reject(new Error('Not valid'))
                }
              })
              .catch(() => {
                return Promise.reject(new Error('Not valid'))
              })
          },
        },
        {
          value: 'password',
          icon: 'lock',
          submit: () => {
            this.$v.data.password.$touch()
            this.$v.data.password_confirmation.$touch()

            if (
              this.$v.data.password.$invalid ||
              this.$v.data.password_confirmation.$invalid
            ) {
              return Promise.reject(new Error('Not valid'))
            }
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters('config', ['input']),
  },
  watch: {
    'data.email'() {
      this.isAvaliable.email = true
    },
    'data.username'() {
      this.isAvaliable.username = true
    },
  },
  methods: {
    nextStep() {
      this.$store.dispatch('wait/start', this.waiter.next)
      this.steps[this.currentStep - 1]
        .submit()
        .then(() => {
          this.currentStep++
        })
        .catch(() => {})
        .finally(() => {
          this.$store.dispatch('wait/end', this.waiter.next)
        })
    },
    previosStep() {
      this.currentStep--
    },
    getStepIndex(value) {
      const stepIndex = this.steps.findIndex((step) => step.value === value)
      return stepIndex === undefined ? null : stepIndex + 1
    },
    onSubmit() {
      if (this.currentStep < this.steps.length) {
        this.nextStep()
      } else {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.$wait.start(this.waiter.submit)
          this.$recaptcha()
            .then((captcha) => {
              this.$axios
                .$post('auth/register/', { captcha, ...this.data })
                .then(({ token, data }) => {
                  this.$auth.setUserToken(token).then(() => {
                    this.$router.push({ name: 'account' })
                  })
                })
                .catch(({ response: { data } }) => {
                  if (data[this.$settings.NON_FIELD_ERRORS_KEY]) {
                    const errors = data[this.$settings.NON_FIELD_ERRORS_KEY]
                    this.$toast.error(
                      Array.isArray(errors) ? errors[0] : errors
                    )
                  } else {
                    this.$toast.error(this.$t('errors.default'))
                  }
                })
                .finally(() => {
                  this.$wait.end(this.waiter.submit)
                })
            })
            .catch(() => {
              this.$toast.error(this.$t('register.captchaError'))
              this.$wait.end(this.waiter.submit)
            })
        }
      }
    },
  },
  head() {
    return {
      title: this.$t('meta.register.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.register.metas.description'),
        },
        {
          name: 'robots',
          vmid: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
  validations() {
    return {
      data: {
        email: {
          required,
          invalid: email,
          notAvailable: () => this.isAvaliable.email,
          maxLength: maxLength(this.input('register.email.max_length', 255)),
        },
        username: {
          required,
          invalid: username,
          notAvailable: () => this.isAvaliable.username,
          maxLength: maxLength(this.input('register.username.max_length', 255)),
          minLength: minLength(this.input('register.username.min_length', 4)),
        },
        password: {
          required,
          maxLength: maxLength(this.input('register.password.max_length', 255)),
          minLength: minLength(this.input('register.password.min_length', 8)),
        },
        password_confirmation: {
          required,
          sameAs: sameAs(() => this.data.password),
        },
      },
    }
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
.v-stepper,
.v-card {
  background: transparent !important;
  border: none;
  box-shadow: none;
  border-radius: 0px;
}

.v-card__actions {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    flex-direction: row;
    justify-content: space-between;
  }
}
.v-application--is-ltr .v-card__actions > .v-btn.v-btn + .v-btn {
  margin-left: 0px !important;
}
.v-stepper__content,
.v-stepper__step {
  padding: 16px;
}
.v-stepper__header {
  box-shadow: none;
}
</style>
