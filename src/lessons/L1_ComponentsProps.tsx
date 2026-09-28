/**
 * LESSON 1 — Components, JSX, props, lists, conditional rendering
 *
 * Key ideas
 * - A component is a function that returns JSX. Its name MUST start with a capital letter.
 * - JSX looks like HTML but it's JavaScript. Differences: className (not class),
 *   htmlFor (not for), style={{ color: 'red' }} (an object), every tag must close (<img />).
 * - { } inside JSX = "evaluate this JavaScript expression" (no if/for statements inside — use ?: and .map).
 * - Props = the single object argument of the component. Data flows DOWN (parent -> child).
 *   A child NEVER modifies its props. To talk back UP, the parent passes a callback function.
 * - A component must return ONE root element. Use a Fragment <>...</> to group without a wrapper div.
 */
import type { ReactNode } from 'react'

// ---- 1. Typing props with TypeScript -------------------------------------
type GreetingProps = {
  name: string
  excited?: boolean // ? = optional
}

// Destructuring the props object in the parameter list; `excited = false` is a default value.
function Greeting({ name, excited = false }: GreetingProps) {
  return (
    <p>
      Hello, {name}
      {excited ? '!' : '.'}
    </p>
  )
}

// ---- 2. children: whatever sits between <Box> and </Box> --------------------
function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="demo-card">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

// ---- 3. Callback props: how a child talks to its parent -------------------
type LikeButtonProps = { label: string; onLike: (label: string) => void }

function LikeButton({ label, onLike }: LikeButtonProps) {
  // onClick gets a FUNCTION. Common mistake: onClick={onLike(label)} calls it immediately during render!
  return <button onClick={() => onLike(label)}>Like {label}</button>
}

// ---- 4. Data for lists -----------------------------------------------------
type Fruit = { id: number; name: string; inSeason: boolean; stock: number }

const fruits: Fruit[] = [
  { id: 1, name: 'Mango', inSeason: true, stock: 12 },
  { id: 2, name: 'Pineapple', inSeason: false, stock: 0 },
  { id: 3, name: 'Pawpaw', inSeason: true, stock: 3 },
]

export default function Lesson1() {
  return (
    <>
      <h2>Lesson 1: Components, JSX and props</h2>
      <p className="hint">Read <code>src/lessons/L1_ComponentsProps.tsx</code> alongside this page.</p>

      <Box title="Props">
        <Greeting name="Lyndon" excited />
        <Greeting name="Bitovi" />
      </Box>

      <Box title="Lists: .map() + a unique, stable key">
        {/* key helps React match items between renders. Use an id — NOT the array index if the list can change order. */}
        <ul>
          {fruits.map((fruit) => (
            <li key={fruit.id}>{fruit.name}</li>
          ))}
        </ul>
      </Box>

      <Box title="Conditional rendering">
        {fruits.map((fruit) => (
          <p key={fruit.id}>
            {fruit.name}: {fruit.inSeason ? 'in season' : 'out of season'}
            {/* && renders the right side only if the left is truthy */}
            {fruit.inSeason && ' 🌞'}
            {/* PITFALL: {fruit.stock && '...'} would render a literal "0" when stock is 0. Use a boolean: */}
            {fruit.stock > 0 ? ` (${fruit.stock} left)` : ' (sold out)'}
          </p>
        ))}
      </Box>

      <Box title="Callback props (child → parent)">
        {/* In real code the parent would store this in state — see Lesson 2 */}
        <LikeButton label="Mango" onLike={(label) => console.log('liked', label)} />
        <p className="hint">Open DevTools → Console, then click.</p>
      </Box>
    </>
  )
}
