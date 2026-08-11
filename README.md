# HomeElevatorInfra

Marketing site for HomeElevatorInfra — home elevators, vacuum lifts, hydraulic
home lifts, cylindrical home lifts, elevator structure design, fabrication,
installation, commissioning and solar water heaters.

React + Vite + TypeScript + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lucide.

## Commands

```bash
npm install
npm run dev          # dev server
npm run build        # type-check + production build
npm run preview      # serve the production build
npm run gen:images   # regenerate the placeholder art in public/images
```

## Design system

Defined once in `src/index.css` under `@theme`:

| Token | Value | Use |
| --- | --- | --- |
| `--color-navy` | `#082B5C` | primary dark sections |
| `--color-charcoal` | `#171A1F` | secondary dark sections |
| `--color-cream` | `#F7F7F5` | page background |
| `--color-gold` | `#B9955A` | accent only — hairlines, indicators, one detail per section |
| `--color-ink` | `#111827` | body text |

Type: **Archivo** for display (set narrow via `font-stretch: 84%`, so headlines
read vertical like the shaft they sell), **Instrument Sans** for body,
**Martian Mono** for labels and data. The `display-type` / `label-type`
utilities in `src/index.css` are the only places those decisions live.

Section rhythm lives in `src/components/ui/Section.tsx` (`pad` prop) — do not add
vertical padding to individual sections, or the two rules will fight.

## Content and data

No product information is hardcoded in components. Edit these instead:

| File | Contents |
| --- | --- |
| `src/data/elevators.ts` | the three elevator systems |
| `src/data/pricing.ts` | official G+1 / G+2 / G+3 starting prices and disclaimers |
| `src/data/colors.ts` | finish, interior and lighting options + their visuals |
| `src/data/services.ts` | the four services |
| `src/data/projects.ts` | project gallery and its filters |
| `src/data/faqs.ts` | FAQ questions and answers |
| `src/data/content.ts` | brand, contact, nav, trust points, process, why, scenes, testimonials |

### Before going live

- `src/data/content.ts` → `brand.phone`, `brand.phoneHref`, `brand.whatsappHref`,
  `brand.email` are **placeholders**.
- `src/data/content.ts` → `testimonials` are **placeholders** with
  `verified: false`; the section shows a visible notice while that is the case.
  Replace with real, verified customer quotes.
- `src/data/projects.ts` → gallery entries name the room, not the client. Add
  household names, cities or dates only where the owner has agreed to be credited.
  Two entries are retail showrooms containing third-party shop branding — confirm
  you hold permission to publish those two before launch.
- Pricing is stated as *starting* pricing everywhere, with no per-option pricing.
  Do not add per-option prices until a rate card exists.

## Photography

`public/images/products/home-lift-gallery-1…12.webp` are photographs of installed
pneumatic vacuum lifts (720×882). They drive:

- the hero visual (`home-lift-gallery-12`)
- the vacuum and cylindrical product sections (`elevators.ts` → `image`)
- the integration showcase (`content.ts` → `architectureScenes`)
- the whole gallery (`projects.ts`)

The hydraulic lift has **no photograph yet** and still uses a rendered stand-in —
`public/images/products/hydraulic.svg`. Drop a real one in and point
`elevators.ts` at it.

### Why the configurator still uses renders

The personalisation viewer keeps the generated studio renders in
`public/images/elevators/*.svg` on purpose: a configurator has to hold the
environment constant so only the finish appears to change. Swapping in photos
taken in twelve different rooms would make every finish change look like a
different house. `ElevatorViewer` skips its interior/lighting/sheen overlays
whenever a caller passes a fixed `image`, so photographs are never tinted.

## Generated artwork

The remaining `public/images/**` files come from
`scripts/gen-placeholders.mjs` — deliberate architectural abstraction rather than
fake photorealism, used only where real photography does not exist yet
(services, "why" section, before/after, hero backdrop, configurator renders).

To swap in real assets: drop `.webp`/`.avif` files in and point the `image`
fields in `src/data/*.ts` at them. Nothing else changes.

## Specifications

`src/data/elevators.ts` carries a `specifications` table and `siteRequirements`
per model — capacity, speed, power, diameter, pit, travel, cabin options. These
are the **manufacturer's published figures** for the systems being installed
(PVE pneumatic, and the hydraulic range), not site-specific promises. Every table
renders with its `specNote` caveat, and the FAQ answers repeat the same numbers.

Verify each figure against your own supplier documentation before launch, and
edit `specNote` if the wording needs to change.

## Configuration state

`ElevatorConfiguration` (`src/types/elevator.ts`) is the single source of truth
for what the visitor is building. `ElevatorConfigProvider`
(`src/hooks/useElevatorConfig.tsx`) holds it; pricing, the personalisation panel,
the summary card and the quote form all read from it.

## Adding the 3D viewer later

The configuration state is already independent of how the elevator is drawn.

- `components/elevator/ElevatorViewer.tsx` — the only file that renders the
  product. Replace the `<img>` crossfade stack with a `<Canvas>` from
  `@react-three/fiber`; the `mode` prop already distinguishes `"image"` from
  `"3d"`.
- `components/elevator/ElevatorMaterials.ts` — the only file that turns
  configuration into appearance. Return `THREE` material parameters instead of
  CSS variables.
- `components/elevator/ElevatorControls.tsx` and `ElevatorConfigurator.tsx` need
  no changes: they write to state and never touch the renderer.

## Motion

All animation goes through `src/hooks/useScrollAnimation.ts` (scoped
`gsap.context`, so triggers never leak) and the `Reveal` / `MaskedHeading`
components. Animations always start from the element's final visible state and
set the "before" state at runtime — with `prefers-reduced-motion: reduce`, or if
JS fails, every section still renders fully.
"# homeelevatorinfra" 
