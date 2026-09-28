export function Header() {
  // TODO (Task 5): read favoriteIds from context (useFavorites) and show the real count
  return (
    <header className="app-header">
      <h1>Chow Finder</h1>
      <span className="badge">Favorites: 0</span>
    </header>
  )
}
