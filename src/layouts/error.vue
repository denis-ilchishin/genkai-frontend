<template>
  <v-container>
    <div class="d-flex justify-center flex-column text-center">
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <a class="mt-2" @click="reloadPage">Обновить страницу</a>
      <a href="/" class="mt-2">Главная</a>
    </div>
  </v-container>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'Страница не найдена',
      otherError: 'Упс, произошла ошибочка',
    }
  },
  methods: {
    reloadPage() {
      window.location.reload()
    },
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
