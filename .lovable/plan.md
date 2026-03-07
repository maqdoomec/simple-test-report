

## Problem
The scrollable content areas in all three panels lack bottom padding, causing the last items to be clipped or hidden behind the panel border/edge.

## Fix
Add bottom padding (`pb-4` or `pb-6`) to the scrollable containers in each panel:

1. **RunList** (`src/components/RunList.tsx`, line 172): Change `p-[10px]` to `p-[10px] pb-6`
2. **ProcessTree** (`src/components/ProcessTree.tsx`, line 164): Change `p-3` to `p-3 pb-6`
3. **ValidationStream** (`src/components/ValidationStream.tsx`, line 177): Change `p-4` to `p-4 pb-6`

This adds extra space at the bottom of each scrollable area so the last items are fully visible when scrolled to the end.

