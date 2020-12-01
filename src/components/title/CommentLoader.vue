<template>
  <div class="loader">
    <div class="loader-image">
      <v-skeleton-loader
        type="image"
        width="50"
        height="50"
      ></v-skeleton-loader>
    </div>
    <div class="loader-content">
      <v-skeleton-loader
        type="heading"
        width="30%"
        class="mb-2"
      ></v-skeleton-loader>
      <v-skeleton-loader type="paragraph" width="100%"></v-skeleton-loader>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loader {
  clear: both;
  height: 100px;
  .loader-image {
    float: left;
    padding: 10px;
  }
  .loader-content {
    float: left;
    width: calc(100% - 100px);
  }
}
</style>
