# React + TypeScript crash prep (Bitovi interview)

## Tonight's plan (about 4½ hours, with breaks)

| Time | Do this |
|------|---------|
| 0:00–0:10 | `npm run dev` → open the URL it prints. `npm test` to see tests run. |
| 0:10–1:40 | **Lessons 1–6** in the app (left sidebar). For each one, read the file in `src/lessons/` **top comment first**, click around, then **change something** (break it, fix it). |
| 1:40–1:50 | Break. Skim the cheat sheet below. |
| 1:50–3:10 | **Mock interview:** `src/exercise/TASKS.md`. Set a 75-minute timer, talk out loud, and use Claude/Copilot the way you would on the call. |
| 3:10–3:40 | Compare your code with `src/solution/`. Say out loud why each difference matters. |
| 3:40–4:10 | Reset the exercise (`git stash` or re-copy it) and redo Tasks 2, 3 and 5 **from memory**. |
| 4:10–4:30 | Read "Likely questions" out loud. Sleep. |

## Commands
```bash
npm run dev                        # app at http://localhost:5173 (hot reload)
npm test                           # run all tests once
npm test -- src/exercise -t "Task 3"   # just one task
npm run test:watch -- src/exercise # re-run on save
npm run typecheck                  # TypeScript errors
npm run lint                       # ESLint (catches hook mistakes!)
```

---

## TypeScript in 5 minutes (only what React code uses)
```ts
let name: string = 'Lyndon'           // usually inferred: let name = 'Lyndon'
let ids: string[] = []
let maybe: string | null = null        // union
type Status = 'idle' | 'loading' | 'done'   // string-literal union (used instead of enums)

type User = { id: number; name: string; email?: string }   // ? = optional
interface User2 { id: number; name: string }                // interface ≈ type for objects

function greet(user: User): string { return `Hi ${user.name}` }
const add = (a: number, b: number) => a + b

// Discriminated union: the `status` field tells TS which other fields exist
type Result = { status: 'ok'; data: User[] } | { status: 'error'; message: string }
if (r.status === 'ok') r.data   // TS knows data exists here

// Generics: a type parameter
function first<T>(arr: T[]): T | undefined { return arr[0] }

user?.email          // optional chaining (undefined instead of crash)
value ?? 'default'   // use default only if null/undefined
import type { Foo } from './foo'   // type-only import
```

### React-specific typing
```tsx
type Props = { title: string; count?: number; onSelect: (id: string) => void; children: React.ReactNode }
function Card({ title, count = 0, onSelect, children }: Props) { ... }

const [items, setItems] = useState<Item[]>([])            // give a type when the initial value is empty or null
const [user, setUser] = useState<User | null>(null)
const inputRef = useRef<HTMLInputElement>(null)

onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault() }}
onClick={(e: React.MouseEvent<HTMLButtonElement>) => ...}
// Inline handlers infer the event type, so you rarely write these out.
```

---

## The React mental model
1. A **component** is a function: `(props) => JSX`. React calls it to find out what the UI should look like.
2. **State changes** (`setX`) → React **re-runs** the function → React updates only the parts of the DOM that changed.
3. The UI is a function of state: **don't touch the DOM by hand**. Change state and let React re-render.
4. Data flows **down** through props. Events flow **up** through callback props.
5. **Never mutate** state or props. Always create new arrays and objects.

## Hooks cheat sheet
| Hook | Use it for | Snippet |
|---|---|---|
| `useState` | a value that changes and should update the UI | `const [v, setV] = useState(0); setV(p => p + 1)` |
| `useEffect` | syncing with the outside world (fetch, timers, subscriptions, document) | `useEffect(() => { ...; return cleanup }, [deps])` |
| `useContext` | reading shared data without prop drilling | `const t = useContext(ThemeContext)` |
| `useReducer` | complex state with many kinds of change | `const [s, dispatch] = useReducer(reducer, init)` |
| `useRef` | DOM access, or a mutable value that doesn't re-render | `const r = useRef<HTMLInputElement>(null)` |
| `useMemo` | caching an expensive derived value | `useMemo(() => calc(a), [a])` |
| `useCallback` | a stable function identity (for memo children or deps) | `useCallback(() => ..., [deps])` |
| `useId` | unique ids for label/input pairs | `const id = useId()` |
| custom `useX` | reusing stateful logic | `function useFetch(url) { ... }` |

**Rules of hooks:** call them only at the top level (not inside `if`, loops, or after an early `return`), and only from components or custom hooks.

## Immutable update patterns (memorise these)
```ts
setList(prev => [...prev, item])                               // add
setList(prev => prev.filter(x => x.id !== id))                  // remove
setList(prev => prev.map(x => x.id === id ? { ...x, done: !x.done } : x))  // update one
setObj(prev => ({ ...prev, name: 'new' }))                      // update a field
const sorted = [...list].sort(...)   // or list.toSorted(...)   // sort WITHOUT mutating
```

## Patterns you'll probably be asked to build
**Fetch with loading and error:** see `src/solution/useRestaurants.ts`
**Filter a list with a search box:** see `src/solution/RestaurantsPage.tsx` (controlled input plus derived `visible`)
**Form:**
```tsx
const [form, setForm] = useState({ name: '', email: '' })
const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  setForm(f => ({ ...f, [e.target.name]: e.target.value }))
<form onSubmit={e => { e.preventDefault(); submit(form) }}>
  <input name="name" value={form.name} onChange={onChange} />
```
**Context:** `src/solution/favoritesContext.ts` and `FavoritesProvider.tsx` (the provider plus a `useX` hook that throws when used outside the provider)
**Reducer:** `src/solution/cartReducer.ts`

## Bug checklist (when "something doesn't update")
- [ ] Is state being **mutated** (`push`, `sort`, `splice`, `obj.x = `)?
- [ ] Is a **list key** missing, or is it an array index on a list that can reorder?
- [ ] Is the `useEffect` **dependency array** missing a value? Or does the effect set state that's also in its own deps (an infinite loop)?
- [ ] Is there a **stale closure**, e.g. `setCount(count + 1)` inside a timer? Use `setCount(c => c + 1)`.
- [ ] Is a hook being called **conditionally**?
- [ ] Is it `onClick={fn()}` instead of `onClick={fn}` or `onClick={() => fn(x)}`?
- [ ] Is `{count && <X/>}` rendering a literal `0`?
- [ ] Is an input that should be controlled missing `value` or `onChange`?
- [ ] Are there async setState calls after unmount, or race conditions? (Use a `cancelled` flag or AbortController.)

## Testing (React Testing Library)
Bitovi values testing, so be ready to read tests or write a small one. See `src/testing/restaurantSpec.tsx`.
```tsx
render(<App />)
screen.getByRole('button', { name: 'Save' })   // prefer role + name (it's how users see the page)
screen.getByLabelText('Email'); screen.getByText('Hello')
await screen.findByText('Loaded')               // findBy = waits (async)
screen.queryByText('Gone')                      // queryBy = returns null instead of throwing
const user = userEvent.setup(); await user.click(btn); await user.type(input, 'abc')
expect(el).toBeInTheDocument(); expect(el).toHaveTextContent('x')
```

---

## Using Claude/Copilot while they watch (this matters a lot)
They're testing **problem-solving and judgment**. They already know the AI can write React.
1. **Explore first (about 5 minutes):** open the file tree, `package.json` (which libraries? React Router? React Query?), run the app, run the tests. Say out loud what you notice.
2. **Ask Claude to explain before you ask it to write:** "Explain how data flows from X to Y in this codebase." It's fine to learn on the spot.
3. **Write specific prompts:** name the file, the goal, the constraints, and the existing patterns. For example: *"In `RestaurantsPage.tsx`, add a controlled search input that filters `restaurants` by name, case-insensitive. Keep the existing style. Don't add libraries."*
4. **Review every line it gives you, out loud:** "This uses a functional update, which is good because…" or "It mutated the array here, so I'll fix that." Catching an AI mistake is a strong signal to the interviewers.
5. **Make small steps and verify each one:** run the app or tests after every change.
6. **When stuck:** say what you've tried and what you'd try next. Silence is worse than being wrong.
7. **Be honest:** "React is newer to me, but my approach to X is…" comes across much better than bluffing, and you have transferable fundamentals.

## Likely questions (short answers)
- **Props vs state?** Props come from the parent and are read-only. State is owned by the component and changing it causes a re-render.
- **Why keys?** They let React match list items between renders. Without stable keys, state and DOM can attach to the wrong item.
- **useEffect deps?** The effect re-runs when any dep changes. `[]` means it runs once on mount. The returned function is the cleanup.
- **Why is my effect running twice?** StrictMode does that in development to surface missing cleanups. It doesn't happen in production.
- **useMemo vs useCallback?** useMemo caches a *value*. useCallback caches a *function*. Both are optimisations.
- **Controlled vs uncontrolled input?** Controlled means `value` comes from state. Uncontrolled means the DOM keeps the value and you read it with a ref.
- **Context vs Redux vs props?** Use props for close components. Use Context for app-wide values that change rarely (theme, auth, favourites). Use a store library (Redux/Zustand) for large, frequently changing global state. For server data, use React Query/SWR.
- **What triggers a re-render?** A state change, the parent re-rendering, or a context value changing.
- **Virtual DOM / reconciliation?** React compares the new JSX tree with the previous one and applies only the differences to the real DOM.
- **How do you lift state up?** Move the state to the closest common parent and pass it down as props, along with setter callbacks.
- **Why TypeScript?** It catches errors at compile time, documents props and API shapes, and gives better editor autocomplete and safer refactors.

## GitHub Codespaces notes
It's VS Code running in the browser. The terminal is at the bottom (Ctrl+`). When you run `npm run dev`, a **Ports** popup appears. Click "Open in Browser". The Copilot or Claude chat is in the side panel, so keep it visible on your screen share.
