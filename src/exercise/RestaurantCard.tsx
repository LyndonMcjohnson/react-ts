import type { Restaurant } from '../api/restaurants'

type RestaurantCardProps = {
  restaurant: Restaurant
  onOrder: (restaurant: Restaurant) => void
}

export function RestaurantCard({ restaurant, onOrder }: RestaurantCardProps) {
  return (
    <li className="card" aria-label={restaurant.name}>
      {/* TODO (Task 1): show the name in an <h3>
                         and a <p> like "Italian · Accra · ⭐ 4.2" (hint: toFixed(1)) */}

      <div className="row">
        {/* TODO (Task 5): add a button that shows "☆ Favorite" or "★ Favorited"
                           and toggles the favorite when clicked (use useFavorites()) */}
        <button onClick={() => onOrder(restaurant)}>Order from here</button>
      </div>
    </li>
  )
}
