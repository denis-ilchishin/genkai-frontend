<script>
import PlayerSelector from './PlayerSelector'
export default {
  mixins: [PlayerSelector],
  data() {
    return {
      search: ''
    }
  },
  methods: {
    getSortedEpisodes(translation) {
      return translation.episodes
        .filter(
          (e) => !e.number || e.number.toString().startsWith(this.search || '')
        )
        .slice(0)
        .sort((a, b) => {
          if (a.number > b.number) return 1
          if (a.number < b.number) return -1
          return 0
        })
    }
  }
}
</script>
