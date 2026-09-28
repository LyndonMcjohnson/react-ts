import { useState, type ComponentType } from 'react'
import './App.css'
import ExerciseApp from './exercise/ExerciseApp'
import Lesson1 from './lessons/L1_ComponentsProps'
import Lesson2 from './lessons/L2_State'
import Lesson3 from './lessons/L3_Effects'
import Lesson4 from './lessons/L4_RefMemoCallback'
import Lesson5 from './lessons/L5_Context'
import Lesson6 from './lessons/L6_ReducerCustomHooks'
import SolutionApp from './solution/SolutionApp'

// A lookup table of pages. `ComponentType` = "any React component".
const PAGES: { id: string; label: string; Component: ComponentType }[] = [
  { id: 'l1', label: '1. JSX & props', Component: Lesson1 },
  { id: 'l2', label: '2. useState', Component: Lesson2 },
  { id: 'l3', label: '3. useEffect', Component: Lesson3 },
  { id: 'l4', label: '4. useRef / useMemo', Component: Lesson4 },
  { id: 'l5', label: '5. Context', Component: Lesson5 },
  { id: 'l6', label: '6. useReducer & hooks', Component: Lesson6 },
  { id: 'exercise', label: '🧪 Exercise', Component: ExerciseApp },
  { id: 'solution', label: '✅ Solution', Component: SolutionApp },
]

export default function App() {
  const [pageId, setPageId] = useState('l1')
  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0]

  return (
    <div className="layout">
      <nav className="nav">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={p.id === pageId ? 'active' : undefined}
            onClick={() => setPageId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </nav>
      <div className="content">
        {/* key: switching pages mounts a fresh component (state resets) */}
        <page.Component key={page.id} />
      </div>
    </div>
  )
}
