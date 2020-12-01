<template>
  <v-rating
    :value="userRate"
    :length="maxRate"
    :half-increments="!$auth.loggedIn"
    :readonly="!$auth.loggedIn || $wait.is(waiter)"
    clearable
    dense
    class="rating"
    hover
    color="yellow darken1"
    @input="onChange"
  />
</template>

<script>
export default {
  props: {
    title: { type: Object, required: true }
  },
  data() {
    return {
      waiter: 'title.userRating',
      maxRate: 10,
      userRate: this.$auth.loggedIn
        ? 0
        : parseFloat(this.title.relevant_data.rating_average)
    }
  },
  watch: {
    title() {
      this.userRate = this.$auth.loggedIn
        ? 0
        : parseFloat(this.title.relevant_data.rating_average)
      this.loadUserRate()
    }
  },
  created() {
    this.loadUserRate()
  },
  methods: {
    loadUserRate() {
      if (process.client && this.$auth.loggedIn) {
        this.$axios
          .$get(`users/title-ratings/${this.title.slug}/`)
          .then((data) => {
            if (data) {
              this.userRate = data.rate
            }
          })
      }
    },

    onChange(newRate) {
      const oldRate = this.userRate
      this.userRate = newRate
      if (this.$auth.loggedIn) {
        // is authenticated
        if (newRate) {
          // rate is not none => add/change rate
          this.$wait.start(this.waiter)
          this.$axios
            .$post(`users/title-ratings/`, {
              rate: newRate,
              title: this.title.slug
            })
            .then(({ rate }) => {
              this.$toast.default(
                this.$tc('success.titleRatings.rate', rate, { rate }),
                {
                  queue: false
                }
              )
            })
            .catch(() => {
              this.userRate = oldRate
            })
            .finally(() => {
              this.$wait.end(this.waiter)
            })
        } else if (newRate === 0) {
          // rate is 0 (vuetify's remove action), so we delete the rate
          this.$wait.start(this.waiter)
          this.$axios
            .delete(`users/title-ratings/${this.title.slug}/delete`)
            .then(() => {
              this.$toast.default(this.$t('success.titleRatings.unrate'), {
                queue: false
              })
            })
            .catch(() => {
              this.userRate = oldRate
            })
            .finally(() => {
              this.$wait.end(this.waiter)
            })
        }
      } else if (newRate !== null) {
        this.$toast.error(this.$t('title.rating.auth'), { queue: false })
        this.userRate = oldRate
      }
    }
  }
}
// import { defineComponent, ref, watch, useContext } from 'nuxt-composition-api'
// export default defineComponent({
//   props: {
//     title: { type: Object, required: true }
//   },
//   setup(props, { root: { $t, $tc } }) {
//     const { $axios, $toast, $auth } = useContext()
//     const maxRate = 10
//     const userRate = ref(parseFloat(props.title.relevant_data.rating_average))
//     // const loadUserRate = () => {
//     //   $axios.$get(`users/title-rating/${props.title}/`).then((data) => {})
//     // }

//     // if (process.client && $auth.loggedIn) {
//     //   loadUserRate()
//     // }
//     // const selectedRate = ref(props.userRating)

//     watch(userRate, (newRate, oldRate) => {
//       if ($auth.loggedIn) {
//         // is authenticated
//         if (newRate) {
//           // rate is not none => add/change rate
//           $axios
//             .$post(`users/title-ratings/`, {
//               rate: newRate,
//               title: props.title.slug
//             })
//             .then(({ rate }) => {
//               $toast.default($tc('success.titleRatings.rate', rate, { rate }), {
//                 queue: false
//               })
//             })
//             .catch(() => {
//               userRate.value = oldRate
//             })
//         } else if (newRate === 0) {
//           // rate is 0 (vuetify's remove action), so we delete the rate
//           $axios.delete(`users/title-ratings/${props.title.slug}/`).then(() => {
//             $toast.default($t('success.titleRatings.unrate'), {
//               queue: false
//             })
//           })
//         }
//       } else if (newRate !== null) {
//         $toast.error($t('title.rating.auth'), { queue: false })
//         userRate.value = null
//       }
//     })

//     return {
//       maxRate,
//       userRate
//     }
//   }
// })
</script>

<style></style>
