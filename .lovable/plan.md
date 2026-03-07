

## Plan: Fix Build & Apply UI Improvements

The app cannot render because Lovable expects `index.html` and `src/` at the project root, but everything is inside `client/`. We need to restructure first, then apply UI polish.

### Step 1: Restructure project to root level

Move the following from `client/` to root:
- `client/index.html` → `index.html`
- `client/src/*` (App.tsx, main.tsx, index.css, mockData.ts, components/) → `src/`
- `client/vite.config.ts` → `vite.config.ts`
- `client/postcss.config.js` → `postcss.config.js`
- `client/tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` → root
- `client/package.json` dependencies merged into root `package.json`

### Step 2: UI Improvements

Based on comparing the current React components against the reference HTML and general polish:

1. **Background gradient overlay** — Add the subtle purple/green radial gradient from `dashbord.html` (body `::before` with radial gradients) to `index.css`. Currently the background is flat `#0a0a14`.

2. **Inter font** — Import Inter from Google Fonts. Currently using system fonts.

3. **Header button label fix** — The Pause button shows "⏸ Paused (Mock)" when NOT paused. Should show "⏸ Pause" when live and "▶ Resume" when paused.

4. **StatCards duplication** — All 6 cards repeat an identical ~80-char class string. Extract a reusable `StatCard` sub-component to reduce duplication.

5. **Toast slide-in animation** — `animate-slide-in` is referenced in ToastContainer but never defined. Add the keyframe to `index.css`.

6. **Status-colored hover glow on stat cards** — Add subtle colored box-shadow on hover: green glow for Passed, red for Failed, etc.

7. **Empty state improvements** — RunList and ProcessTree empty states are plain italic text. Add a simple icon and slightly better styling.

