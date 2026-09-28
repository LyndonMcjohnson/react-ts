/**
 * LESSON 5 — Context API: share data without "prop drilling"
 *
 * Prop drilling = passing a prop through components that don't use it, just to reach a deep child.
 * Context lets any descendant read a value directly.
 *
 * The 3 steps:
 *   1. const ThemeContext = createContext<ThemeValue | null>(null)
 *   2. Wrap a subtree: <ThemeContext.Provider value={...}>...</ThemeContext.Provider>
 *   3. Read it anywhere below: const theme = useContext(ThemeContext)
 *
 * Best practice (what interviewers like to see):
 *   - A Provider component that owns the state
 *   - A custom hook (useTheme) that throws a helpful error if used outside the provider
 *   - Memoize the value object so consumers don't re-render needlessly
 *
 * When NOT to use context: data only 1–2 levels down (just pass props), or rapidly-changing values
 * used by many components (every consumer re-renders on change). For big apps: Redux/Zustand/React Query.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' // union of string literals — like an enum
type ThemeContextValue = { theme: Theme; toggleTheme: () => void }

// 1. Create
const ThemeContext = createContext<ThemeContextValue | null>(null)

// 2. Provider component that owns the state
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }),
    [theme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 3. Custom hook for consumers
function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}

// ---- Consumers, several levels deep. Note: NO theme props passed down! ----
function Toolbar() {
  return (
    <div className="row">
      <ThemedButton />
      <ThemeLabel />
    </div>
  )
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>Switch to {theme === 'light' ? 'dark' : 'light'}</button>
}

function ThemeLabel() {
  const { theme } = useTheme()
  return <span>Current theme: {theme}</span>
}

function ThemedPanel({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const style = theme === 'dark' ? { background: '#1e1e2e', color: '#eee' } : { background: '#fff', color: '#222' }
  return (
    <div style={{ ...style, padding: 16, borderRadius: 8, border: '1px solid #ccc' }}>{children}</div>
  )
}

export default function Lesson5() {
  return (
    <>
      <h2>Lesson 5: Context API</h2>
      <div className="demo-card">
        <ThemeProvider>
          <ThemedPanel>
            <Toolbar />
            <p>This panel, the button and the label all read the same context.</p>
          </ThemedPanel>
        </ThemeProvider>
      </div>
      <p className="hint">
        Real example: <code>src/solution/favoritesContext.ts</code> and <code>FavoritesProvider.tsx</code>.
      </p>
    </>
  )
}
