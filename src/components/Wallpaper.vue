<template>
  <picture :id="id" :title="title" :alt="alt">
    <template>
      <template v-for="breakpoint in Object.keys(imageSizeSet)">
        <source
          v-for="format in getFormats()"
          :key="`${format}_${breakpoint}`"
          :srcset="getSrcset(format, imageSizeSet[breakpoint])"
          :type="`image/${format}`"
          :media="getMedia(breakpoint)"
        />
      </template>
    </template>
    <img
      :id="id"
      :src="imageSet[`jpg_2x_${imageSizeSet[$breakpoint.name]}`]"
      :alt="alt"
      :title="title"
    />
  </picture>
</template>

<script>
export default {
  props: {
    imageSet: { type: Object },
    imageSizeSet: { type: Object },
    alt: { type: String },
    title: { type: String },
    id: { type: String },
  },
  data() {
    return {
      baseUrl: this.$settings.clientApiUrl,
      sizes: this.$settings.image_sizes,
      formats: { webp: 'webp', jpeg: 'jpg' },
      deviceSizes: ['2x'],
    }
  },
  methods: {
    getFormats() {
      return this.imageSet ? Object.keys(this.formats) : []
    },
    getMedia(breakpoint) {
      let width = this.$vuetify.breakpoint.thresholds[breakpoint]
      const isBiggest = !Object.keys(this.$vuetify.breakpoint.thresholds)
        .filter((th) => Object.keys(this.imageSizeSet).includes(th))
        .find((th) => this.$vuetify.breakpoint.thresholds[th] > width)
      if (isBiggest) {
        width = Object.values(
          this.$vuetify.breakpoint.thresholds
        ).reduce((a, b) => (a < width && b < width ? b : a))
        return `(min-width: ${width}px)`
      } else {
        return `(max-width: ${width - 1}px)`
      }
    },
    getSrcset(format, imageSize) {
      const srcset = []
      for (const deviceSize of this.deviceSizes) {
        const ext = this.formats[format]
        const pxl = deviceSize
        const size = imageSize
        srcset.push(this.baseUrl + `${this.imageSet[`${ext}_${pxl}_${size}`]}`)
      }
      return srcset.join(',')
    },
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';
picture {
  display: flex;
}
img {
  width: 100%;
}
</style>
