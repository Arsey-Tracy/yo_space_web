# YoSpaces — Site Build Reference

Use this file as context when prompting a coding agent (Claude Code, Copilot, Cursor, etc.)
to build or update the YoSpaces public site. Paste the relevant section into the prompt,
or point the agent at this file directly.

---

## 1. Project context

YoSpaces is a B2B2C platform for organizations (SACCOs, churches, schools) to reach
members via bulk SMS and two-way surveys, on a pay-as-you-go wallet model — no
subscription. Stack: Vite + React + TypeScript + Tailwind.

---

## 2. Sitemap (public-facing only)

```bash
/ (Home)
   ├── #how-it-works   (anchor section, not a route)
   ├── #pricing         (anchor section, not a route)
   ├── /login    → app boundary, out of scope for this site
   └── /signup   → app boundary, out of scope for this site

Footer-only, never in top nav:
   ├── /terms
   └── /privacy
```

Rules:

- Only Home, Login, and Signup are real routes at launch. How It Works and Pricing are
  anchor sections on Home, not separate pages.
- Terms and Privacy links live in the footer only. Never add them to the top nav.
- Do not add About, or any other page unless explicitly requested — the sitemap
  is intentionally minimal until there's a real reason to expand it.

---

## 3. Design tokens — source of truth

Defined in `tailwind.config.ts`. Never use arbitrary hex values (`bg-[#e8a33d]`) in
components — always use the token classes below.

| Token | Class | Hex | Use for |
| --- | --- | --- | --- |
| Ink | `bg-ink` / `text-ink` | `#12151C` | Dark surfaces (nav, sidebar), headline text on light bg |
| Paper | `bg-paper` | `#EEF1F4` | Page background — cool, not warm cream |
| Card | `bg-card` | `#FFFFFF` | Card/panel surfaces |
| Primary | `bg-primary` / `text-primary` | `#E8A33D` | Primary buttons, active nav state, key highlights |
| Success | `text-success` | `#1F6F5C` | Delivered/positive states |
| Alert | `text-alert` | `#C1443C` | Errors, destructive actions — use sparingly, never decoratively |
| Muted | `text-muted` | `#6B7280` | Secondary text, labels, timestamps |
| Line | `border-line` | `#DEE2E7` | Borders, dividers |

**Typography** — two faces max, never introduce a third:

- `font-display` (Space Grotesk) — headings, stat numbers only
- `font-sans` (Inter) — body text, default
- `font-mono` (IBM Plex Mono) — phone numbers, PINs, codes, any tabular data

**Radius:** default `10px` everywhere (cards, buttons, inputs). Not 0, not pill-shaped.
Do not introduce a different radius scale.

---

## 4. Component rules

- Build on the existing primitives in `src/components/ui/` — `Button`, `Card`,
  `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Input`. Do not create a
  parallel button/card implementation inline with raw `<button>`/`<div>` + Tailwind
  classes duplicated per-page.
- New reusable UI goes in `src/components/ui/`, following the same pattern: typed props,
  `cva` for variants if there's more than one visual style, `cn()` for class merging.
- Page-specific sections (Hero, PricingSection, etc.) go in `src/components/sections/`,
  composed from the primitives above — not new one-off styled elements.
- No third-party UI kit imports (no MUI, no Chakra, no Bootstrap). Tailwind + these
  primitives only.

## 5. Design principles to hold to

- Two typefaces max (see above). Never add a third.
- Avoid generic-AI-app defaults: no purple-to-blue gradients, no default-Inter-only pages,
  no warm cream (`#F4F1EA`-ish) backgrounds — Paper is cool-toned on purpose.
- One signature visual element per screen at most — don't stack multiple decorative
  effects (gradients + shadows + glows) on the same component.
- Real copy over lorem ipsum, always — ask for real content if none is provided rather
  than shipping placeholder text.
- Generous whitespace over cramped layouts.
- Semantic HTML: `<nav>`, `<main>`, `<button>`, not `<div onClick>`. Visible focus states
  on every interactive element — never remove `outline` without a replacement.
- Check contrast on amber-on-white specifically — it's the token most likely to fail
  accessibility contrast checks; prefer amber-on-ink for text-on-color situations.

---

## 6. Ready-to-use prompts

Copy one of these into your coding agent, editing the bracketed part.

### Build a new page

```txt
Build the [PAGE NAME] page for YoSpaces at src/pages/[route].tsx.

Follow YOSPACES_SITE_REFERENCE.md in this repo for:
- design tokens (use Tailwind token classes, never arbitrary hex values)
- typography rules (font-display / font-sans / font-mono, two faces max)
- component rules (build on Button/Card/Input primitives in src/components/ui/,
  don't create parallel one-off styled elements)
- the sitemap (confirm this page's route matches what's defined there before building)

Content for this page: [paste real copy, or ask me for it before generating placeholder text]
```

### Add a new section to Home

```md
Add a [SECTION NAME] section to the Home page (src/pages/Home.tsx), placed [before/after]
the [existing section] section.

Follow YOSPACES_SITE_REFERENCE.md for design tokens and component rules. Use the existing
Section wrapper pattern already used by other sections on this page — don't introduce a
new layout wrapper.
```

### Add a new UI primitive

```txt
Add a new [COMPONENT NAME] primitive to src/components/ui/, following the existing
pattern in button.tsx and card.tsx: typed props via a TypeScript interface, cva() for
variants if there's more than one visual style, cn() for class merging, forwardRef if
it wraps a native form element.

Use only the design tokens defined in tailwind.config.ts — no new colors, no arbitrary
hex values.
```

### Audit existing code against these rules

```txt
Review [FILE OR DIRECTORY] against YOSPACES_SITE_REFERENCE.md and flag:
- any hardcoded hex values that should be token classes
- any inline-styled buttons/cards/inputs that should use the shared primitives instead
- any third typeface introduced beyond Space Grotesk / Inter / IBM Plex Mono
- any page or nav link that doesn't match the sitemap in section 2
- any missing focus states or non-semantic interactive elements (div onClick, etc.)

List what you find before making changes — don't auto-fix without confirming first.
```

### Fix a specific design inconsistency

```txt
[Describe what looks off, e.g. "the pricing card on Home doesn't match the card styling
used in the dashboard"]. Check YOSPACES_SITE_REFERENCE.md section 3-4 for the correct
tokens/pattern and bring this in line with it.
```

---

## 7. What NOT to do

- Don't invent new colors outside the token table, even for "just this one accent."
- Don't add pages outside the sitemap without asking first.
- Don't put Terms/Privacy links in the top nav.
- Don't reach for a UI kit dependency when a primitive can be added to `src/components/ui/`
  instead.
- Don't ship placeholder/lorem ipsum copy as final content.
