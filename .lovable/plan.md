

## Test Execution Report — Simple & Clean

A single-page test execution report built with minimal, clean styling (~100 lines of code):

### What it includes:
- **Summary header** — Total tests, passed, failed, skipped counts with color-coded badges
- **Progress bar** — Visual pass/fail ratio
- **Test results table** — Test name, status (pass/fail/skip), duration
- **Sample data** — ~10 hardcoded test cases to demonstrate the layout

### Design:
- Clean, minimal styling using Tailwind (since it's already in the project)
- Green for pass, red for fail, yellow for skipped
- Single `Index.tsx` page, no extra components

