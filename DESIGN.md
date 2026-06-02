---
name: Steven Lema Portfolio
description: Cinematic true-red developer portfolio (EN/ES)
colors:
  background-dark: "#080808"
  background-light: "#f9f7f6"
  foreground-dark: "#f5f5f5"
  foreground-light: "#0a0a0a"
  primary-dark: "#dc2626"
  primary-light: "#b91c1c"
  primary-glow: "#f87171"
  accent-warm: "#ea580c"
  card-dark: "#111111"
  muted-foreground-dark: "#a8a8a8"
  border-dark: "#2e2e2e"
typography:
  display:
    fontFamily: "Syne, system-ui, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontWeight: 500
rounded:
  sm: "0.5rem"
  md: "0.875rem"
  lg: "1rem"
  xl: "1.75rem"
  full: "9999px"
spacing:
  section-y: "4rem"
  section-y-lg: "8rem"
  container-x: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-dark}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.75rem"
  hero-badge:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1rem"
---

## Overview

Single-page bilingual portfolio (Astro 5, Tailwind v4). Dark-first cinematic look with true red accents (not rose/pink). Audience: recruiters and clients evaluating full-stack work. Motion is purposeful; hero content is always visible without waiting for JS.

## Colors

- **Primary red**: `#dc2626` (dark) / `#b91c1c` (light). Use for CTAs, links, timeline dots, progress bars.
- **Background**: near-black `#080808` with subtle red mesh gradients (low opacity).
- **Surfaces**: `#111111` cards with `border-primary/20`, no heavy neon glow on every element.
- **Text**: `#f5f5f5` body; `muted-foreground` for secondary copy only (not long paragraphs).
- Canonical OKLCH lives in `src/styles/global.css` tokens.

## Typography

- **Display**: Syne 800 for names and section titles. Hero name uses gradient fill (brand exception); outline subline uses red stroke.
- **Body**: DM Sans for paragraphs and UI.
- **Mono**: JetBrains Mono for dates, eyebrows (sparingly), status chip.
- Hero name clamp max ~5rem; section h2 scales `text-2xl` to `3.25rem`.

## Elevation

- Prefer 1px borders tinted with primary over wide drop shadows.
- `hero-photo-frame`: soft shadow + 1px primary ring (no double neon).
- Cards: `shadow-card` only; avoid `shadow-glow-sm` on buttons (ghost-card tell).

## Components

- **Header**: fixed 4.5rem; scroll nav on tablet; full nav on lg+. Hero needs extra top padding so availability badge clears header.
- **Hero**: badge pill, 2 CTAs, social row, photo with in-frame status card.
- **Sections**: `section-shell` max-width 6xl; no numbered `01/06` markers; h2-only headers.
- **Reveal**: below-fold sections may fade in; hero never starts at opacity 0.

## Do's and Don'ts

**Do**
- Keep hero badge fully below fixed header on all breakpoints.
- Use `prefers-reduced-motion` fallbacks.
- Maintain 44px min touch targets on buttons and icon links.

**Don't**
- Section-number eyebrows or scroll cues.
- Stack `border + large blur shadow` on the same button.
- Hide above-the-fold content behind `data-reveal` without a visible default.
- Use em dashes in user-facing copy.
