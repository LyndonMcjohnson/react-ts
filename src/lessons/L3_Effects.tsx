/**
 * LESSON 3 — useEffect: syncing with things OUTSIDE React (network, timers, document, subscriptions)
 *
 *   useEffect(() => {
 *     // runs AFTER render
 *     return () => { ... }   // optional cleanup: runs before the next effect run & on unmount
 *   }, [deps])
 *
 * Dependency array:
 *   no array  -> runs after EVERY render (rarely what you want)
 *   []        -> runs once after the first render (mount)
 *   [a, b]    -> runs after first render and whenever a or b changed
 * Rule: every value from the component that the effect USES goes in the deps. (The eslint plugin checks this.)
 *
 * Classic bugs:
 * - Infinite loop: an effect sets state that is also in its own deps (or no deps at all).
 * - Missing cleanup: intervals/listeners keep running after unmount.
 * - Race conditions: an old request finishes after a new one -> use a `cancelled` flag or AbortController.
 * - "You might not need an effect": if you can compute it from props/state during render, just compute it.
 *
 * In dev, <StrictMode> runs effects twice (mount -> cleanup -> mount) on purpose to expose missing cleanups.
 */
import { useEffect, useState } from 'react'
import { fetchRestaurants, mockServer, type Restaurant } from '../api/restaurants'

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    console.log('Clock: interval started')
    return () => {
      clearInterval(id) // without this, the timer keeps running after <Clock> disappears
      console.log('Clock: interval cleared')
    }
  }, [])

  return <p>🕒 {now.toLocaleTimeString()}</p>
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Restaurant[] }

function RestaurantLoader() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchRestaurants()
      .then((data) => !cancelled && setState({ status: 'success', data }))
      .catch((e: unknown) => !cancelled && setState({ status: 'error', message: String(e) }))
    return () => {
      cancelled = true
    }
  }, [reloadCount]) // re-run whenever reloadCount changes

  function reload() {
    setState({ status: 'loading' }) // set state in the EVENT HANDLER, not synchronously inside the effect
    setReloadCount((n) => n + 1)
  }

  return (
    <div>
      <div className="row">
        <button onClick={reload}>Reload</button>
        <label>
          <input
            type="checkbox"
            defaultChecked={mockServer.failRequests}
            onChange={(e) => (mockServer.failRequests = e.target.checked)}
          />{' '}
          Make the server fail
        </label>
      </div>
      {state.status === 'loading' && <p>Loading...</p>}
      {state.status === 'error' && <p className="error">Error: {state.message}</p>}
      {state.status === 'success' && (
        <ul>
          {state.data.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Lesson3() {
  const [count, setCount] = useState(0)
  const [showClock, setShowClock] = useState(true)

  // Effect with a dependency: sync the browser tab title with `count`
  useEffect(() => {
    document.title = `Clicked ${count} times`
  }, [count])

  return (
    <>
      <h2>Lesson 3: useEffect</h2>

      <div className="demo-card">
        <h4>Sync with the document (deps = [count])</h4>
        <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
        <p className="hint">Look at the browser tab title.</p>
      </div>

      <div className="demo-card">
        <h4>Cleanup (setInterval)</h4>
        <button onClick={() => setShowClock((s) => !s)}>{showClock ? 'Unmount' : 'Mount'} clock</button>
        {showClock && <Clock />}
        <p className="hint">Watch the console when you mount/unmount.</p>
      </div>

      <div className="demo-card">
        <h4>Data fetching: loading / error / success</h4>
        <RestaurantLoader />
      </div>
    </>
  )
}
