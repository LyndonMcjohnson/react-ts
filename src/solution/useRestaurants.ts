import { useEffect, useState } from 'react'
import { fetchRestaurants, type Restaurant } from '../api/restaurants'

// A "discriminated union": the `status` field tells TypeScript which other fields exist.
export type RestaurantsState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Restaurant[] }

/** Custom hook = a function starting with "use" that calls other hooks. */
export function useRestaurants(): RestaurantsState {
  const [state, setState] = useState<RestaurantsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false // guards against setting state after unmount

    fetchRestaurants()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', error: err instanceof Error ? err.message : 'Unknown error' })
        }
      })

    return () => {
      cancelled = true // cleanup runs on unmount (and before the effect re-runs)
    }
  }, []) // [] = run once after the first render

  return state
}
