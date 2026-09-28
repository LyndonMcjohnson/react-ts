/**
 * LESSON 4 — useRef, useMemo, useCallback, memo
 *
 * useRef(initial) -> { current }
 *   1. Grab a DOM element:   <input ref={inputRef} />  then inputRef.current.focus()
 *   2. Keep a mutable value that survives re-renders but does NOT trigger one (timer ids, previous values).
 *   Don't read/write ref.current during render — do it in event handlers or effects.
 *
 * useMemo(() => compute(), [deps])  -> caches a computed VALUE until deps change.
 * useCallback(fn, [deps])           -> caches a FUNCTION identity until deps change.
 * memo(Component)                   -> skips re-rendering a child if its props are the same (===).
 *
 * These are performance tools. Correct code shouldn't depend on them. Reach for them when:
 *   - a calculation is genuinely expensive, or
 *   - you pass an object/function to a memo() child or into a hook's deps array.
 * In an interview: "I'd measure first; I'd memoize if X". That's the mature answer.
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react'

const NUMBERS = Array.from({ length: 20000 }, (_, i) => i + 1)

function isPrime(n: number) {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

// memo: only re-renders when its props change
const ExpensiveChild = memo(function ExpensiveChild({ onPing }: { onPing: () => void }) {
  console.log('ExpensiveChild rendered')
  return <button onClick={onPing}>Ping from child</button>
})

export default function Lesson4() {
  // ---- useRef #1: DOM access ----
  const inputRef = useRef<HTMLInputElement>(null)

  // ---- useRef #2: mutable box (interval id) ----
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<number | null>(null)

  function start() {
    if (intervalRef.current !== null) return // already running
    intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
  }
  function stop() {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  // ---- useMemo ----
  const [max, setMax] = useState(100)
  const [unrelated, setUnrelated] = useState('')
  const primeCount = useMemo(() => {
    console.log('counting primes up to', max) // not logged when you type in the "unrelated" box
    return NUMBERS.filter((n) => n <= max && isPrime(n)).length
  }, [max])

  // ---- useCallback ----
  const [pings, setPings] = useState(0)
  const handlePing = useCallback(() => setPings((p) => p + 1), [])
  // Try replacing the line above with:  const handlePing = () => setPings(p => p + 1)
  // Now ExpensiveChild re-renders on every keystroke (new function each render => props changed).

  return (
    <>
      <h2>Lesson 4: useRef, useMemo and useCallback</h2>

      <div className="demo-card">
        <h4>useRef: DOM element</h4>
        <div className="row">
          <input ref={inputRef} placeholder="I'll get focused" />
          <button onClick={() => inputRef.current?.focus()}>Focus input</button>
        </div>
      </div>

      <div className="demo-card">
        <h4>useRef: mutable value (stopwatch: {seconds}s)</h4>
        <div className="row">
          <button onClick={start}>Start</button>
          <button onClick={stop}>Stop</button>
          <button onClick={() => setSeconds(0)}>Reset</button>
        </div>
      </div>

      <div className="demo-card">
        <h4>useMemo: {primeCount} primes up to {max}</h4>
        <input type="range" min={10} max={20000} value={max} onChange={(e) => setMax(Number(e.target.value))} />
        <input value={unrelated} onChange={(e) => setUnrelated(e.target.value)} placeholder="unrelated state" />
        <p className="hint">Console: typing in "unrelated" doesn't recompute.</p>
      </div>

      <div className="demo-card">
        <h4>useCallback + memo (pings: {pings})</h4>
        <ExpensiveChild onPing={handlePing} />
      </div>
    </>
  )
}
