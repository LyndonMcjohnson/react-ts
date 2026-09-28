import type { ReactNode } from 'react'
import { FavoritesContext, type FavoritesContextValue } from './favoritesContext'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // TODO (Task 5): keep favoriteIds in state and implement toggleFavorite / isFavorite.
  // Hint: update the array immutably — use filter() to remove and [...prev, id] to add.
  const value: FavoritesContextValue = {
    favoriteIds: [],
    isFavorite: () => false,
    toggleFavorite: () => {},
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
