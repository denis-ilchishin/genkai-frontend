import { ITitleGenres } from '~/types/title'

export const useFormatTitleGenres = (
  title: ITitleGenres,
  length: number = 3
) => {
  return (
    title.genres
      .slice(0, length)
      .map((g) => g.name)
      .join(', ') + (title.genres.length > length ? '...' : '')
  )
}
