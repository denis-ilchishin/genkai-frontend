<template>
  <v-chip
    class="title-rating-chip title px-5"
    color="yellow darken-1"
    label
    dark
    :title="$t('title.rating.chipTitle', { title: title.name })"
    >{{ average }}</v-chip
  >
</template>

<script>
export default {
  props: { title: { type: Object, required: true } },
  computed: {
    average() {
      return this.title.relevant_data.rating_average
    },
    total() {
      return this.title.relevant_data.rating_total
    },
  },
}
</script>

<style scoped lang="scss">
.title-rating-chip {
  width: 90px;
  text-shadow: 0.5px 0px 3px rgba(0, 0, 0, 0.9);
  justify-content: center;
}
</style>
