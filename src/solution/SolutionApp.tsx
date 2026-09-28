import { FavoritesProvider } from './FavoritesProvider'
import { Header } from './Header'
import { RestaurantsPage } from './RestaurantsPage'

export default function SolutionApp() {
  return (
    <FavoritesProvider>
      <Header />
      <RestaurantsPage />
    </FavoritesProvider>
  )
}
