# Plan: Fix Rendering + Implement React Router

## TL;DR

- **Rendering Issue**: `topLabel` prop not destructured in AuthLayout.tsx → fix by adding to destructuring
- **Routing**: Implement React Router v6 with LoginPage and RegisterPage
- **Approach**: Fix immediate bug → install react-router-dom → refactor App.tsx to use routing

---

## Problem Analysis

### Current State

- **app/web/src/main.tsx** - Entry point, renders App correctly ✓
- **app/web/src/App.tsx** - Renders LoginPage directly (no routing)
- **app/web/src/components/organisms/AuthLayout.tsx** - Missing `topLabel` destructuring (LINE 31 ERROR)
  - The prop `topLabel` is used in the return statement but not destructured from props
  - This causes: `Uncaught ReferenceError: topLabel is not defined`
- **app/web/package.json** - React Router v6 not installed yet
- **app/web/src/pages/** - LoginPage and RegisterPage exist but no routing between them

### Root Cause

1. `topLabel` not destructured in AuthLayout line 16-21
2. App.tsx hardcoded to only show LoginPage (no navigation)
3. react-router-dom dependency missing

---

## Solution Architecture

### Phase 1: Fix Critical Bug (Blocker)

**File**: [apps/web/src/components/organisms/AuthLayout.tsx](apps/web/src/components/organisms/AuthLayout.tsx)

- **Change**: Add `topLabel` to the destructuring statement (line 16-21)
- **Before**: `{ bannerSrc, title, subtitle, form, footerLink }`
- **After**: `{ bannerSrc, title, subtitle, form, footerLink, topLabel }`
- **Effect**: Unblocks rendering - app will display LoginPage without console errors

### Phase 2: Install Dependencies

**Command**: `pnpm add react-router-dom` (from apps/web directory)

- **Installs**: react-router-dom v6+ for client-side routing
- **Also updates**: pnpm-lock.yaml with new dependency

### Phase 3: Create Router Configuration

**New File**: `apps/web/src/router.tsx`

- Defines all application routes using React Router v6
- Routes:
  - `GET /` → Redirect to `/login`
  - `GET /login` → LoginPage component
  - `GET /register` → RegisterPage component
  - `GET *` → NotFoundPage (simple 404)
- Exports: `router` object for use in App.tsx

### Phase 4: Refactor App Component

**File**: [apps/web/src/App.tsx](apps/web/src/App.tsx)

- **Change**: Replace direct LoginPage render with RouterProvider
- **Before**: Direct `<LoginPage />` component rendering
- **After**: `<RouterProvider router={router} />`
- **Imports**: Add RouterProvider from react-router-dom, import router from ./router

### Phase 5: Create NotFound Page (Fallback)

**New File**: `apps/web/src/pages/NotFoundPage.tsx`

- Simple fallback page for invalid routes
- Shows message and link back to login

---

## Implementation Steps

### Step 1: Fix AuthLayout.tsx

- Add `topLabel` to destructuring
- Verification: No TypeScript errors

### Step 2: Install React Router

- Run: `pnpm add react-router-dom`
- Verification: Package.json updated, pnpm-lock.yaml has new entries

### Step 3: Create router.tsx

- Define routes configuration
- Create NotFoundPage component
- Verification: File exists, exports `router` object

### Step 4: Update App.tsx

- Import RouterProvider and router
- Wrap return with RouterProvider
- Remove LoginPage import
- Verification: TypeScript passes, no console errors

### Step 5: Verify in Browser

- Start dev server: `pnpm dev`
- Check:
  1. http://localhost:5173 shows LoginPage
  2. No console errors
  3. Click "Crie seu cadastro!" navigates to /register
  4. RegisterPage renders
  5. Manual URL navigation works (/login, /register)
  6. Invalid routes show NotFound page

---

## Expected Outcome

✓ Browser renders LoginPage on initial load (no errors)
✓ Navigation links work between login and register pages
✓ URL state reflects current page
✓ Refreshing maintains correct page
✓ Invalid routes handled gracefully
✓ Console clean (no ReferenceError, no warnings)

---

## Rollback Plan

If issues arise:

1. Revert App.tsx to direct LoginPage render
2. Keep AuthLayout.tsx fix (always needed)
3. Can remove react-router-dom if needed

---

## Files Modified

- `apps/web/src/components/organisms/AuthLayout.tsx` — Fix destructuring
- `apps/web/package.json` — Add react-router-dom (via pnpm)
- `apps/web/src/router.tsx` — NEW: Route configuration
- `apps/web/src/App.tsx` — Update to use RouterProvider
- `apps/web/src/pages/NotFoundPage.tsx` — NEW: 404 fallback

---

## Execution Timeline

- Phase 1 (Fix bug): ~1 min
- Phase 2 (Install): ~2 min
- Phase 3 (Create router.tsx): ~3 min
- Phase 4 (Update App.tsx): ~1 min
- Phase 5 (Verify): ~2 min

**Total**: ~9 minutes estimated
