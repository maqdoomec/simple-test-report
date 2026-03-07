

## Fix: Vertical Scrolling for All Three Panels + Build Error

### Problem
1. The main grid uses `items-start` which prevents panels from stretching to full height, breaking scroll containers.
2. Build error: unused variable `tc` in `App.tsx` line 308.

### Changes

**`src/App.tsx`**
- Line 308: Remove unused `tc` variable (fix build error).
- Line 358: Change `items-start` to `items-stretch` on the grid container so all three panels fill the available height.

**`src/components/RunList.tsx`**
- Ensure the outer container has `h-full` and `min-h-0` so flexbox children can properly overflow-scroll. Add `min-h-0` to the scrollable list area.

**`src/components/ProcessTree.tsx`**
- Add `min-h-0` to the outer flex-col container and the scrollable tree area to enable proper flex-based scrolling.

**`src/components/ValidationStream.tsx`**
- Add `min-h-0` to the outer flex-col container so the scrollable validation list can shrink and scroll properly.

The root cause is a classic flexbox scrolling issue: flex children need `min-h-0` (overriding the default `min-height: auto`) to allow `overflow-y: auto` to work within a constrained-height flex parent.

