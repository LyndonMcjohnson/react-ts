import { useState } from 'react'
import { sampleRestaurants, type Restaurant } from '../api/restaurants'

// A "discriminated union": the `status` field tells TypeScript which other fields exist.
export type RestaurantsState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Restaurant[] }

export function useRestaurants(): RestaurantsState {
  // TODO (Task 2): This is a fake. It returns hard-coded data immediately.
  //  - Start in the { status: 'loading' } state
  //  - In a useEffect, call fetchRestaurants() (from '../api/restaurants')
  //  - When it succeeds -> { status: 'success', data }
  //  - When it fails    -> { status: 'error', error: <message> }
  //  - Bonus: add a cleanup function so you never set state after unmount
  const [data] = useState(() => structuredClone(sampleRestaurants))
  return { status: 'success', data }
}
