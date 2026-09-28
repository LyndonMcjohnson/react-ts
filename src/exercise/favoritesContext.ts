import { createContext, useContext } from 'react'

export type FavoritesContextValue = {
  favoriteIds: string[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

/** Use this in any component under <FavoritesProvider>. */
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>')
  return ctx
}
