

## UI Improvements Plan

After reviewing all components and the reference `dashbord.html`, here are the issues and improvements:

### 1. Add background gradient + Inter font (index.html + index.css)
- Import Inter font in `index.html` via Google Fonts link
- Add `body::before` radial gradient overlay (purple top-left, green bottom-right) matching the reference
- Update `--font-sans` to use Inter

### 2. Fix Header button label
- Line 55 in Header.tsx: when NOT paused, it shows "⏸ Paused (Mock)" which is wrong. Change to "⏸ Pause" when not paused.

### 3. Add missing `animate-slide-in` keyframe
- ToastContainer uses `animate-slide-in` class but it's never defined. Add the keyframe to `index.css`.

### 4. Extract reusable StatCard component
- All 6 cards in StatCards.tsx repeat the same ~200-char class string. Extract a `StatCard` sub-component with props for label, value, and color. Add status-colored hover glow (green for passed, red for failed, etc.).

### 5. Fix border-color references
- Multiple components use `border-border-color` which is not defined in the theme. Should be `border-border-medium`.

### 6. Better empty states
- RunList and ProcessTree empty states are plain italic text. Add a simple icon above the text.

### 7. Fix `bg-bg-card-hover` reference
- Header.tsx line 52 uses `bg-bg-card-hover` which doesn't exist in the theme. Replace with `hover:bg-white/5`.

### Files to change:
- `index.html` — add Inter font link
- `src/index.css` — add gradient overlay, slide-in keyframe, update font
- `src/components/Header.tsx` — fix button label, fix undefined color class
- `src/components/StatCards.tsx` — extract StatCard, add hover glow
- `src/components/RunList.tsx` — fix `border-border-color` refs, improve empty state
- `src/components/ProcessTree.tsx` — improve empty state with icon

