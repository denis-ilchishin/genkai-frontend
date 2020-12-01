<template>
  <form @submit.prevent="submit">
    <v-row>
      <v-col>
        <div v-if="comment.reply_to" class="d-flex align-items-center mb-2">
          <v-btn
            icon
            small
            class="mr-1"
            :title="$helpers.c($t('comments.cancelReply'))"
            @click="$emit('cancel')"
          >
            <v-icon small>close</v-icon>
          </v-btn>
          <span>
            {{ $helpers.c($t('comments.replyToUser')) }}
            <span class="subtitle-1 font-weight-medium">
              {{ comment.reply_to.user.username }}
            </span>
          </span>
        </div>
        <v-textarea
          v-model="comment.text"
          :label="$helpers.c($t('comments.label'))"
          :counter="maxLength"
          :autofocus="autofocus"
          filled
          rounded
          rows="3"
        ></v-textarea>
      </v-col>
    </v-row>
    <div class="d-flex justify-center justify-sm-end">
      <v-btn
        color="primary"
        :loading="$wait.is('comments.submit')"
        :disabled="$v.$invalid"
        rounded
        type="submit"
      >
        {{ $t('comments.submit') }}
        <v-icon right>send</v-icon>
      </v-btn>
    </div>
  </form>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
export default {
  props: {
    replyTo: {
      type: Object,
      default: () => null,
    },
    text: {
      type: String,
      default: '',
    },
    autofocus: { type: Boolean, default: false },
    titleId: { type: [String, Number], required: true },
  },
  data() {
    return {
      maxLength: this.$store.getters['config/input'](
        'comments.comment.max_length',
        255
      ),
      comment: {
        text: this.text,
        reply_to: this.replyTo,
      },
    }
  },
  methods: {
    submit() {
      if (this.$auth.loggedIn) {
        if (!this.$v.$invalid) {
          this.$wait.start('comments.submit')
          this.$axios
            .$post('comments/titles/', {
              reply_to: this.comment.reply_to ? this.comment.reply_to.id : null,
              text: this.comment.text,
              title: this.titleId,
            })
            .then((comment) => {
              this.$toast.default(this.$t('success.comments.submit'))
              this.$emit('submit', comment)
              this.clearForm()
            })
            .catch((err) => {
              console.error(err)
              // this.$pr(err)
            })
            .finally(() => {
              this.$wait.end('comments.submit')
            })
        }
      } else {
        this.$toast.error(this.$t('comments.authToComment'), {
          queue: false,
        })
      }
    },
    clearForm() {
      this.comment.text = ''
      this.comment.reply_to = null
    },
  },
  validations() {
    return {
      comment: {
        text: {
          required,
          maxLength: maxLength(this.maxLength),
        },
      },
    }
  },
}
</script>

<style scoped lang="scss"></style>
