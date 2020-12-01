<script>
export default {
  data() {
    const sizes = [100, 300, 500]
    const placeholders = {}

    for (const size of sizes) {
      placeholders[
        size
      ] = `${this.$settings.placeholdersPath}/placeholder_${size}.jpg`
    }

    return {
      placeholders,
      sizes,
    }
  },
  methods: {
    closestSize(size) {
      return this.sizes.reduce((prev, curr) => {
        return Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
      })
    },
    getPlaceholderSrc(size) {
      return this.placeholders[this.closestSize(size)]
    },
    getImageSrc(imageSrc, size) {
      if (!imageSrc) {
        return this.getPlaceholderSrc(size || this.sizes[this.size.length - 1])
      } else if (!size) {
        return imageSrc.original
      } else {
        return imageSrc[this.closestSize(size)]
      }
    },
  },
}
</script>
