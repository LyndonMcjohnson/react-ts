import type { Restaurant } from '../api/restaurants'
import { useFavorites } from './favoritesContext'

type RestaurantCardProps = {
  restaurant: Restaurant
  onOrder: (restaurant: Restaurant) => void
}

export function RestaurantCard({ restaurant, onOrder }: RestaurantCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(restaurant.id)

  return (
    <li className="card" aria-label={restaurant.name}>
      <h3>{restaurant.name}</h3>
      <p>
        {restaurant.cuisine} · {restaurant.city} · ⭐ {restaurant.rating.toFixed(1)}
      </p>
      <div className="row">
        <button aria-pressed={favorite} onClick={() => toggleFavorite(restaurant.id)}>
          {favorite ? '★ Favorited' : '☆ Favorite'}
        </button>
        <button onClick={() => onOrder(restaurant)}>Order from here</button>
      </div>
    </li>
  )
}
