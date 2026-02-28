# Ticket: Responsive Layout System Stabilization

## Goal
Make homepage structure reliable across display sizes/orientations (phone portrait/landscape, tablet, laptop, desktop) so elements stay in-frame, aligned, and proportionally spaced.

## Scope
- `src/components/Main.tsx`
- `src/components/SlidePanelShell.tsx` (only if needed for responsive panel behavior)
- `src/app/globals.css`

## Acceptance Criteria
- No hero/founder/patent elements clipped or overlapping at key widths.
- Stable alignment/margins on portrait and landscape phones.
- Consistent spacing rhythm between sections/components.
- Founder modal remains visible and usable on all tested viewport sizes.

## Test Viewports
- `360x800` (small phone portrait)
- `390x844` (modern phone portrait)
- `844x390` (phone landscape)
- `768x1024` (tablet portrait)
- `1024x768` (tablet/mini laptop landscape)
- `1440x900` (desktop)

## Tasks

### Step 1: Establish Global Layout Tokens
- Add CSS variables in `globals.css` for:
  - page max width
  - horizontal gutters
  - section vertical spacing
  - content gapsnow 
  - responsive icon sizing tokens (if needed)
- Ensure tokens use `clamp()` where appropriate.

### Step 2: Normalize Section Container Pattern
- Apply one shared container pattern for Hero, Founders, Patents, Associations:
  - same max width
  - same gutter behavior
  - consistent vertical rhythm
- Remove ad-hoc per-section padding mismatches.

### Step 3: Hero Responsive Layout Modes
- Mobile (`<768`):
  - move side arrows below image in a controlled row
  - keep top title/subtitle/image/CTA arrow fully inside frame
- Desktop (`>=1024`):
  - allow side arrows near image with safe offsets
- Keep subtitle line breaks readable and stable.

### Step 4: Founders Section Responsive Grid + Rhythm
- Mobile:
  - stable card sizes (`1` or `2` columns only)
  - no overlap of ring animations/text
- Desktop:
  - `4` columns with balanced spacing
- Keep top/bottom transition arrows in-frame and centered.

### Step 5: Modal Responsive Mode Split
- Mobile:
  - bottom-sheet style (`~85-90vh`, safe top inset)
- Desktop:
  - centered dialog
- Keep portal rendering and closing behavior consistent.

### Step 6: Remove Fragile Fixed Offsets
- Replace remaining hardcoded offsets/magic numbers with:
  - tokenized spacing
  - `clamp()`
  - breakpoint-specific classes
- Keep animation paths gentle and viewport-safe.

### Step 7: Cross-Viewport Verification Pass
- Verify all sections at listed viewports.
- Fix any clipping/overlap regressions.
- Final visual alignment/margin polish pass.

## Execution Plan
We will implement one step at a time:
1. Implement step.
2. Report exactly what changed.
3. You verify visually.
4. Proceed to next step only after your confirmation.
