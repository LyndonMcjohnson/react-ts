/**
 * LESSON 2 — useState, events, controlled inputs, immutable updates
 *
 * Key ideas
 * - const [value, setValue] = useState(initial)
 * - Calling setValue schedules a RE-RENDER: React calls your component function again,
 *   and `value` has the new value on that next call. (Within the current render it does NOT change.)
 * - If the new value depends on the old one, use the updater form: setCount(c => c + 1)
 * - NEVER mutate state (arr.push, obj.x = 1, arr.sort()). React compares by reference;
 *   create a NEW array/object: [...arr, x], arr.filter(), arr.map(), { ...obj, x: 1 }
 * - Controlled input: value comes from state, onChange writes to state. State is the "single source of truth".
 * - Derived values (counts, filtered lists, totals) are computed during render — don't store them in state.
 */
import { useState, type FormEvent } from 'react'

type Todo = { id: number; text: string; done: boolean }

export default function Lesson2() {
  // ---- counter ----
  const [count, setCount] = useState(0)

  function addThreeWrong() {
    // All three read the same `count` from THIS render -> only +1
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }
  function addThreeRight() {
    // Updater functions queue up -> +3
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  // ---- controlled input + array state ----
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn useState', done: true },
    { id: 2, text: 'Learn useEffect', done: false },
  ])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stop the browser from reloading the page
    if (!text.trim()) return
    setTodos((prev) => [...prev, { id: Date.now(), text: text.trim(), done: false }]) // ADD
    setText('') // clears the input because the input is controlled
  }

  function toggle(id: number) {
    // UPDATE one item: map + spread
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(id: number) {
    // REMOVE: filter
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  // ---- object state ----
  const [profile, setProfile] = useState({ name: 'Lyndon', role: 'Engineer' })

  const remaining = todos.filter((t) => !t.done).length // derived — NOT state

  return (
    <>
      <h2>Lesson 2: useState and events</h2>

      <div className="demo-card">
        <h4>Counter: {count}</h4>
        <div className="row">
          <button onClick={() => setCount(count + 1)}>+1</button>
          <button onClick={addThreeWrong}>+3 (wrong way)</button>
          <button onClick={addThreeRight}>+3 (updater fn)</button>
          <button onClick={() => setCount(0)}>Reset</button>
        </div>
      </div>

      <div className="demo-card">
        <h4>Todos ({remaining} remaining)</h4>
        <form onSubmit={handleSubmit} className="row">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
          <button type="submit">Add</button>
        </form>
        <p className="hint">You typed: "{text}"</p>
        <ul>
          {todos.map((t) => (
            <li key={t.id}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />{' '}
                <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
              </label>{' '}
              <button onClick={() => remove(t.id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="demo-card">
        <h4>Object state</h4>
        <input
          value={profile.name}
          // spread the old object, overwrite one field
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
          <option>Engineer</option>
          <option>Manager</option>
        </select>
        <p>
          {profile.name} — {profile.role}
        </p>
      </div>
    </>
  )
}
