
Goal: fix the clipping at the bottom of all three panels (not a padding issue).

Findings from code + runtime check:
- With Mock ON, after scrolling each panel to 100%, the last items are still cut off.
- This happens in all three panels, so the shared parent layout is the problem.
- Root cause: the main grid uses fixed viewport math (`h-[calc(100vh-80px)]` / `h-[calc(100vh-160px)]`) while it sits inside a padded/gapped flex page with header/banner/stats above it and `overflow-hidden`. The grid ends up taller than the true remaining space, so its bottom is clipped.

Implementation plan:
1) Replace fixed grid height with true remaining-space layout
- In `src/App.tsx`, change the main grid container from calc-height classes to:
  - `flex-1 min-h-0 grid ...`
- Keep existing `gridTemplateColumns` behavior for resizable side panels.

2) Make top sections explicit non-flexing blocks
- Ensure header/banner/stats wrappers are `shrink-0` so only the grid consumes leftover height.
- Remove margin-based vertical spacing that makes height accounting brittle, and rely on parent `gap` for spacing consistency.

3) Keep panel internals as-is
- Keep existing panel scroll containers (`min-h-0 overflow-y-auto`) and current `pb-6`.
- No further per-panel padding tweak needed once parent clipping is fixed.

4) Preserve collapsed-stats behavior
- Keep `isStatsCollapsed` and compact summary bar transitions.
- Remove dependency between stats state and hardcoded grid height (no more `100vh - N` logic).  
- When stats collapse, grid naturally expands via flex.

5) Verification checklist (runtime)
- Mock: ON
- Test with stats expanded and collapsed.
- Test at `1366x768` and `1024x768`.
- In each of the 3 panels, scroll to bottom and confirm final row/card is fully visible (not clipped).

Technical details:
```text
Before:
App (h-screen, overflow-hidden)
  Header + Banner + Stats + Grid(h: calc(100vh - N))
=> Grid can exceed actual remaining area -> bottom of panels cut.

After:
App (h-screen, overflow-hidden, flex-col)
  Header(shrink-0)
  Banner(shrink-0)
  Stats(shrink-0, collapsible)
  Grid(flex-1, min-h-0)
=> Grid always fits remaining area -> panel bottoms fully reachable.
```

Files to update:
- `src/App.tsx`
- `src/components/Header.tsx` (remove margin-only spacing dependence, add shrink-safe class)
- `src/components/StatCards.tsx` (remove extra bottom margin to avoid double vertical spacing)
