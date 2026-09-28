import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { FavoritesContext } from './favoritesContext'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  const toggleFavorite = useCallback((id: string) => {
    // functional update + immutable array operations (never .push / .splice on state)
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  // useMemo so consumers only re-render when favoriteIds actually changes
  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite: (id: string) => favoriteIds.includes(id),
      toggleFavorite,
    }),
    [favoriteIds, toggleFavorite],
  )

  // React 19 also allows <FavoritesContext value={value}>; .Provider works everywhere.
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
