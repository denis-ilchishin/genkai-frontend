<template>
  <v-flex sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
    <form @submit.prevent="onSubmit">
      <v-card color="transparent" flat>
        <v-card-title class="display-1 justify-center">
          {{ $t('login.title') }}
        </v-card-title>
        <v-col cols="12">
          <v-text-field
            v-model.trim="credentials.email"
            :label="$t('login.fields.username.label')"
            :error="
              $v.credentials.email.$invalid && $v.credentials.email.$dirty
            "
            :error-messages="
              getInputErrorMessage(
                $v.credentials.email,
                $t('login.fields.username.errors'),
                true
              )
            "
            filled
            dense
            rounded
            class="rounded-lg"
            @blur="$v.credentials.email.$touch()"
          />
          <v-text-field
            v-model.trim="credentials.password"
            :label="$t('login.fields.password.label')"
            :error="
              $v.credentials.password.$invalid && $v.credentials.password.$dirty
            "
            :error-messages="
              getInputErrorMessage(
                $v.credentials.password,
                $t('login.fields.password.errors'),
                true
              )
            "
            :type="showPassword ? 'text' : 'password'"
            filled
            dense
            rounded
            class="rounded-lg"
            @blur="$v.credentials.password.$touch()"
          >
            <template v-slot:append>
              <v-tooltip v-if="showPassword" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="showPassword = false">
                    visibility_off
                  </v-icon>
                </template>
                <span>{{ $t('login.fields.password.hide') }}</span>
              </v-tooltip>
              <v-tooltip v-else bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="showPassword = true">
                    visibility
                  </v-icon>
                </template>
                <span>{{ $t('login.fields.password.show') }}</span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn
            text
            color="primary"
            :to="{ name: 'register' }"
            :small="$breakpoint.xsOnly"
          >
            {{ $t('login.register') }}
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            class="px-4"
            :loading="$wait.is(waiter)"
            rounded
          >
            <v-icon left>exit_to_app</v-icon>
            {{ $t('login.submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
    <!-- <v-col>
      <client-only>
        <LoginViaSocialMedia :waiter="waiter" />
      </client-only>
    </v-col> -->
  </v-flex>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { useVuelidateInputMessages } from '~/mixins/VuelidateInputMessages'

export default {
  middleware: 'guest',
  data() {
    return {
      waiter: 'login',
      prevRoute: null,
      showPassword: false,
      credentials: { email: '', password: '' },
    }
  },
  computed: {
    ...mapGetters('config', ['input']),
  },
  methods: {
    onSubmit() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.$wait.start(this.waiter)
        this.$auth
          .loginWith('local', { data: this.credentials })
          .then((res) => {
            this.$router.replace(
              (this.prevRoute && this.prevRoute.path !== '/'
                ? this.prevRoute
                : false) || {
                name: 'account',
              }
            )
            setTimeout(() => {
              this.$toast.default(
                this.$t('login.success', {
                  username: this.$auth.user.username,
                })
              )
            })
          })
          .catch((err) => {
            console.error(err)

            const code = parseInt(err.response && err.response.status)

            switch (code) {
              case 400:
                this.$toast.error(
                  err.response.data.non_field_errors[0] ||
                    err.response.data.detail
                )
                this.$toast.error(this.$t('login.caseSensitive'))
            }
          })
          .finally(() => {
            this.$wait.end(this.waiter)
          })
      }
    },
    getInputErrorMessage: useVuelidateInputMessages().getInputErrorMessage,
  },
  validations() {
    return {
      credentials: {
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      },
    }
  },
  head() {
    return {
      title: this.$t('meta.login.title'),
      meta: [
        {
          name: 'description',
          vmid: 'description',
          content: this.$t('meta.login.metas.description'),
        },
        {
          name: 'robots',
          vmid: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
}
</script>

<style></style>
