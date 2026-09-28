import { useMemo, useState } from 'react'
import type { Restaurant } from '../api/restaurants'
import { OrderPanel } from './OrderPanel'
import { RestaurantCard } from './RestaurantCard'
import { useRestaurants } from './useRestaurants'

const NO_RESTAURANTS: Restaurant[] = [] // stable reference (defined outside the component)

export function RestaurantsPage() {
  // Rules of hooks: ALL hooks at the top, never after an early `return` or inside an if.
  const state = useRestaurants()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [sortByRating, setSortByRating] = useState(false)
  const [selected, setSelected] = useState<Restaurant | null>(null)

  const restaurants = state.status === 'success' ? state.data : NO_RESTAURANTS
  const cities = useMemo(
    () => [...new Set(restaurants.map((r) => r.city))].sort(),
    [restaurants],
  )

  if (state.status === 'loading') return <p>Loading...</p>
  if (state.status === 'error') return <p role="alert">Could not load restaurants</p>

  // Derived data — computed during render, NOT stored in state.
  // FIX for Task 4: copy before sorting. .sort() mutates the array it's called on (React state!).
  const sorted = sortByRating ? [...restaurants].sort((a, b) => b.rating - a.rating) : restaurants
  const query = search.trim().toLowerCase()
  const visible = sorted.filter(
    (r) => r.name.toLowerCase().includes(query) && (city === 'all' || r.city === city),
  )

  return (
    <main>
      <div className="filters">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Restaurant name"
        />

        <label htmlFor="city">City</label>
        <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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

      {/* key={selected.id}: a new key = a brand-new component = fresh cart state (Task 7) */}
      {selected && (
        <OrderPanel key={selected.id} restaurant={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
