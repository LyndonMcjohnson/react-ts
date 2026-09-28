import { useState } from 'react'
import type { Restaurant } from '../api/restaurants'
import { OrderPanel } from './OrderPanel'
import { RestaurantCard } from './RestaurantCard'
import { useRestaurants } from './useRestaurants'

const NO_RESTAURANTS: Restaurant[] = []

export function RestaurantsPage() {
  const state = useRestaurants()
  const [sortByRating, setSortByRating] = useState(false)
  const [selected, setSelected] = useState<Restaurant | null>(null)
  // TODO (Task 3): add state for the search text and the chosen city

  const restaurants = state.status === 'success' ? state.data : NO_RESTAURANTS
  // TODO (Task 3): work out the list of unique cities (A→Z) from `restaurants` (useMemo)

  if (state.status === 'loading') return <p>Loading...</p>
  if (state.status === 'error') return <p role="alert">Could not load restaurants</p>

  const sorted = sortByRating ? restaurants.sort((a, b) => b.rating - a.rating) : restaurants
  // TODO (Task 3): filter `sorted` by search text + city
  const visible = sorted

  return (
    <main>
      <div className="filters">
        <label htmlFor="search">Search</label>
        {/* TODO (Task 3): make this a controlled input (value + onChange) */}
        <input id="search" placeholder="Restaurant name" />

        <label htmlFor="city">City</label>
        {/* TODO (Task 3): controlled select + one <option> per city */}
        <select id="city">
          <option value="all">All cities</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={sortByRating}
            onChange={(e) => setSortByRating(e.target.checked)}
          />{' '}
          Sort by rating
        </label>
      </div>

      {visible.length === 0 ? (
        <p>No restaurants match</p>
      ) : (
        <ul className="grid" aria-label="Restaurants">
          {visible.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onOrder={setSelected} />
          ))}
        </ul>
      )}

      {selected && <OrderPanel restaurant={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
