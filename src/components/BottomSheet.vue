<template>
  <v-bottom-sheet app :value="show" fullscreen scrollable>
    <!-- <div class="blur"></div> -->
    <v-card height="100%" flat tile color="transparent" dark>
      <slot />
    </v-card>
  </v-bottom-sheet>
</template>

<script>
export default {
  props: { show: { type: [Boolean, String, Object, Number] } }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';

// @supports (backdrop-filter: $menu-background-blur) {
//   .v-dialog__content::v-deep {
//     backdrop-filter: blur(0px);
//     .v-bottom-sheet {
//       background-color: $menu-background-color-alpha;
//     }
//   }
//   .v-dialog__content--active {
//     backdrop-filter: $menu-background-blur;
//   }
// }

// @supports not (backdrop-filter: $menu-background-blur) {
.v-dialog__content::v-deep {
  .v-bottom-sheet {
    background-color: $menu-background-color;
  }
}
// }
</style>
