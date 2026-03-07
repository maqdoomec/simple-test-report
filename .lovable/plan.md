

## Fix: Vertical Scrolling in All Three Panels

The issue is that the scrollable content divs inside each panel lack `min-h-0`, which is required for `overflow-y: auto` to work inside a flex column. The outer containers already have `min-h-0`, but the inner scrollable areas also need it.

### Changes

**`src/components/RunList.tsx` (line 172)**
- Add `min-h-0` to the scrollable list div: `flex-1 overflow-y-auto min-h-0 p-[10px] bg-bg-card custom-scrollbar`

**`src/components/ProcessTree.tsx`**
- Line 66 (empty state): Add `min-h-0` to the outer div
- Line 164 (tree content): Add `min-h-0` to the scrollable tree div: `flex-1 overflow-y-auto min-h-0 p-3 text-[13px] custom-scrollbar scroll-smooth`

**`src/components/ValidationStream.tsx`**
- The expanded content area (the `ref={containerRef}` div) needs `min-h-0` added to its class list

Additionally, remove `overflow-hidden` from the outer containers of all three panels — this conflicts with the inner scroll. The outer flex-col should use `min-h-0` without `overflow-hidden`; only the scrollable child should have `overflow-y-auto`.

### Root Cause
`overflow-hidden` on the outer flex container prevents the flex child from computing its constrained height properly. Removing it and ensuring every flex-col ancestor has `min-h-0` allows `overflow-y: auto` on the scroll container to activate correctly.

