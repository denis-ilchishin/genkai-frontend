<script>
import PlayerSelector from './PlayerSelector'
export default {
  mixins: [PlayerSelector],
  methods: {
    getSortedEpisodes(translation) {
      return translation.episodes.slice(0).sort((a, b) => {
        if (a.number > b.number) return 1
        if (a.number < b.number) return -1
        return 0
      })
    }
  }
}
</script>
