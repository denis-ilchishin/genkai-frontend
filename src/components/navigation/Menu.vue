<template>
  <BottomSheet :id="code" :show="show">
    <v-card-title class="justify-space-between">
      <span class="headline">{{ title }}</span>
      <v-btn icon x-large @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <slot name="extend"></slot>
    <v-card-text class="pa-0">
      <slot />
    </v-card-text>
  </BottomSheet>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, required: true },
    title: { type: String, required: true },
    code: { type: String, required: true },
  },
}
</script>
