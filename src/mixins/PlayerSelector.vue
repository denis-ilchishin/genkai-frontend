<script>
export default {
  props: {
    translations: { required: true, type: Array },
    episode: { type: Object },
    translation: { type: Object }
  },
  data() {
    return {
      selectedTranslation: this.translation,
      selectedEpisode: this.episode,
      timeout: null
    }
  },
  computed: {
    sortedTranslations() {
      return this.translations.slice(0).sort((a, b) => {
        if (a.translator.name > b.translator.name) return 1
        if (a.translator.name < b.translator.name) return -1
        return 0
      })
    },
    translatorSubheader() {
      return this.selectedTranslation.is_other
        ? this.selectedTranslation.translator.name
        : this.$t('title.translations.playerControls.translator', {
            translator: this.selectedTranslation.translator.name
          })
    }
  },
  watch: {
    episode(to) {
      if (
        !this.selectedEpisode ||
        (to && this.selectedEpisode && to.id !== this.selectedEpisode.id)
      )
        this.selectedEpisode = to
    },
    translation(to) {
      if (
        !this.selectedTranslation ||
        (to &&
          this.selectedTranslation &&
          to.id !== this.selectedTranslation.id)
      )
        this.selectedTranslation = to
    },
    selectedTranslation(to) {
      if (to) {
        this.$nextTick(() => {
          this.scrollToEpisode()
        })
      }
    }
  },
  methods: {
    getTranslatorSelectText(translation) {
      return this.$t(
        this.$breakpoint.smOnly
          ? 'title.translations.translatorText'
          : 'title.translations.translatorTextMobile',
        {
          translator: translation.translator.name,
          range: translation.rangeText
        }
      )
    },
    scrollToEpisode() {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (this.translation && this.episode && this.$refs.episodesList) {
          if (this.translation.id === this.selectedTranslation.id) {
            this.$refs.episodesList.scrollTo(
              this.translation.episodes.findIndex(
                (e) => e.id === this.episode.id
              )
            )
          } else {
            this.$$refs.episodesList.scrollTo(0)
          }
        }
      })
    }
  }
}
</script>
