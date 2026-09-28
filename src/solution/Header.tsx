import { useFavorites } from './favoritesContext'

export function Header() {
  const { favoriteIds } = useFavorites()
  return (
    <header className="app-header">
      <h1>Chow Finder</h1>
      <span className="badge">Favorites: {favoriteIds.length}</span>
    </header>
  )
}
