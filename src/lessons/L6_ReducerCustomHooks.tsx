/**
 * LESSON 6 — useReducer and custom hooks
 *
 * useReducer is useState for state with several related fields / many ways to change.
 *   const [state, dispatch] = useReducer(reducer, initialState)
 *   dispatch({ type: 'increment' })
 * The reducer is a PURE function (state, action) => newState. Easy to test, all logic in one place.
 * TypeScript: describe actions as a union — the compiler then knows `action.amount` only exists on 'add'.
 *
 * Custom hooks: any function whose name starts with "use" and which calls hooks.
 * They let you reuse STATEFUL LOGIC (not UI). Each component calling it gets its own separate state.
 *
 * Rules of hooks (memorize these):
 *   1. Only call hooks at the top level — not inside if/loops/after an early return.
 *   2. Only call hooks from React components or other custom hooks.
 */
import { useEffect, useReducer, useState } from 'react'

// ---------------- useReducer ----------------
type CounterState = { count: number; step: number; history: number[] }

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; step: number }
  | { type: 'reset' }

const initialState: CounterState = { count: 0, step: 1, history: [] }

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step, history: [...state.history, state.count] }
    case 'decrement':
      return { ...state, count: state.count - state.step, history: [...state.history, state.count] }
    case 'setStep':
      return { ...state, step: action.step } // TS knows `step` exists here
    case 'reset':
      return initialState
  }
}

// ---------------- custom hooks ----------------
/** Boolean on/off with a stable toggle. */
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn((v) => !v)
  return [on, toggle] as const // `as const` -> typed as a tuple [boolean, () => void]
}

/** Returns `value`, but only after it stopped changing for `delayMs`. Generic <T> works for any type. */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id) // each keystroke cancels the previous timer
  }, [value, delayMs])
  return debounced
}

/** Tracks window width. */
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}

export default function Lesson6() {
  const [state, dispatch] = useReducer(counterReducer, initialState)
  const [showHistory, toggleHistory] = useToggle()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 500)
  const width = useWindowWidth()

  return (
    <>
      <h2>Lesson 6: useReducer and custom hooks</h2>

      <div className="demo-card">
        <h4>useReducer counter: {state.count}</h4>
        <div className="row">
          <button onClick={() => dispatch({ type: 'decrement' })}>−{state.step}</button>
          <button onClick={() => dispatch({ type: 'increment' })}>+{state.step}</button>
          <label>
            Step{' '}
            <select
              value={state.step}
              onChange={(e) => dispatch({ type: 'setStep', step: Number(e.target.value) })}
            >
              {[1, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
          <button onClick={toggleHistory}>{showHistory ? 'Hide' : 'Show'} history</button>
        </div>
        {showHistory && <p>History: {state.history.join(' → ') || '(none)'}</p>}
      </div>

      <div className="demo-card">
        <h4>useDebouncedValue</h4>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type fast..." />
        <p>
          Immediate: "{query}" · Debounced (500ms): "{debouncedQuery}"
        </p>
        <p className="hint">Use case: don't call a search API on every keystroke.</p>
      </div>

      <div className="demo-card">
        <h4>useWindowWidth: {width}px</h4>
        <p className="hint">Resize the window.</p>
      </div>
    </>
  )
}
