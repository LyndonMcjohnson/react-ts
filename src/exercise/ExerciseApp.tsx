// Start here. See TASKS.md in this folder.
import { FavoritesProvider } from './FavoritesProvider'
import { Header } from './Header'
import { RestaurantsPage } from './RestaurantsPage'

export default function ExerciseApp() {
  return (
    <FavoritesProvider>
      <Header />
      <RestaurantsPage />
    </FavoritesProvider>
  )
}
