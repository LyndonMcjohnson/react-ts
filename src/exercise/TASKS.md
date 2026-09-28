# Mock interview: "Chow Finder"

This is set up the way Bitovi's session probably will be: an existing codebase, a list of tasks,
and tests that tell you when you're done. Give yourself **75 minutes**, talk out loud as you go,
and use Claude the way you would with the interviewer watching.

**Before you write any code (spend about 5 minutes on this):**
1. Run `npm run dev` and open the **Exercise** tab.
2. Read `ExerciseApp.tsx` → `RestaurantsPage.tsx` → `RestaurantCard.tsx`, following the imports.
3. Run `npm test -- src/exercise` and look at which tests fail.

Run a single task's tests with `npm test -- src/exercise -t "Task 2"`.
Use `npm run test:watch -- src/exercise` to re-run the tests every time you save.

| # | Task | File(s) | Concepts |
|---|------|---------|----------|
| 1 | Render the restaurant's name as an `<h3>` and a line like `Italian · Accra · ⭐ 4.2` (always 1 decimal: `4.0`) | `RestaurantCard.tsx` | JSX, props, `{expressions}` |
| 2 | Load restaurants with `fetchRestaurants()` instead of the hard-coded data. Show `Loading...`, then the list, or the error message if the request fails | `useRestaurants.ts` | `useState`, `useEffect`, cleanup, async |
| 3 | Make **Search** filter by name (case-insensitive) and **City** filter by city. Fill the city dropdown from the data (each city once, A→Z). Show `No restaurants match` when nothing matches | `RestaurantsPage.tsx` | controlled inputs, derived state, `useMemo` |
| 4 | **Bug report:** "After I untick *Sort by rating*, the list stays sorted." Find the bug and fix it | `RestaurantsPage.tsx` | immutability |
| 5 | Favorites: add a `☆ Favorite` / `★ Favorited` toggle button on each card, and make the header show the real count | `FavoritesProvider.tsx`, `RestaurantCard.tsx`, `Header.tsx` | Context API, custom hook |
| 6 | Cart: make Add and Remove work, count quantities (`Margherita × 2`), and show the correct total | `cartReducer.ts`, `OrderPanel.tsx` | `useReducer`, TS union types |
| 7 | *Stretch:* switching to another restaurant should start with an empty cart | `RestaurantsPage.tsx` | `key` resets state |
| 8 | *Stretch:* focus the Search box when the page loads | `RestaurantsPage.tsx` | `useRef` + `useEffect` |

If you're stuck for more than 10 minutes, open `src/solution/` and read the answer for that task.
Then close it and write the code again yourself.
