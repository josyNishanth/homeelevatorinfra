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

- Contact details are live in `src/data/content.ts`. `phones` is the source of
  truth and lists both published numbers; `brand.phone` / `brand.phoneHref` alias
  the first one, which is what single-action buttons (Call, WhatsApp, Book a site
  visit) use. WhatsApp currently points at the first number — change
  `brand.whatsappHref` if it should be the second.
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

The hydraulic lift's product image (`elevators.ts` → `image`) is currently
`public/images/products/13.webp`, a cylindrical glass lift in a stairwell atrium —
not actually a hydraulic system. It fills the slot until a real hydraulic
installation photo is supplied; swap it out then.

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

## 3D viewer (Phase 1)

`/customize` renders the real GLB through React Three Fiber. Every other route
still uses the image viewer, and `three` is code-split so only `/customize`
downloads it (main bundle ~463 kB, 3D chunk ~1.05 MB / 290 kB gzip).

```
ElevatorViewer          public API — picks image vs 3D, owns the error fallback
├─ ElevatorImageStack   the original image/crossfade path (unchanged)
└─ Elevator3DViewer     lazy-loaded canvas, camera fit, OrbitControls, overlay
   ├─ ElevatorModel     loads + normalises the GLB, reports its bounding box
   └─ ElevatorLighting  studio rig + procedural environment + contact shadow
```

- Model: `public/models/vacuum-elevator-pve37.glb`, copied byte-identical from
  `3D-model/` (sha1 `355a6be…`). The original is never touched.
- Camera is solved from the measured bounding box — the model fills 72% of the
  viewer height (66% under 640px), and the fit is **locked once the visitor
  interacts** so the camera never snaps back mid-orbit.
- Auto-rotation runs at `autoRotateSpeed` 0.8, pauses on interaction and resumes
  2.4s after it ends. Disabled entirely under `prefers-reduced-motion`.
- `ViewerErrorBoundary` falls back to the image viewer if WebGL or the GLB fails.

### What the GLB contains

Exported by *Khronos glTF Blender I/O v4.2.57*. 44 nodes, 9 meshes, 13
primitives, 4 materials, **0 textures, 0 animations, 0 skins, 0 cameras**. The
hierarchy is flat — every node sits directly under `Scene`. Regenerate this
summary any time with `node scripts/inspect-glb.mjs`.

| Material | Notes |
| --- | --- |
| `[Translucent Glass Gray]` | Glazing. baseColor `0.22` grey, **alpha 1.0 / alphaMode OPAQUE** |
| ` frame color` | Frame — note the **leading space**. No baseColorFactor, so pure white |
| `DefaultMaterial` | baseColor `0.8` grey. Used only on one door primitive |
| `base color` | baseColor `0.573` grey. Cabin inner section |

Meshes: `C-glass-tube-door`, `C-door-ring`, `C-galkss tube door` *(sic)*,
`C-ring#1`, `C-support`, `C-glass tube`, `C-elev cab`, `C-cab-rail`,
`C-inner section#1`. Nodes repeat these via `.001`–`.015` suffixes; the two tube
sections sit at y≈0–2.745 and y≈2.745–5.486, giving a ~5.66-unit-tall G+2 stack.

**Two corrections are applied at load** (in `ElevatorModel`, documented inline):

1. Every primitive ships `POSITION` only — no `NORMAL`. Without normals the
   model renders unlit, so vertex normals are computed on load.
2. The glazing material is exported opaque despite its name, which made the tube
   a solid pipe hiding the cab. Glass is re-enabled as transparent. Pass
   `glassTransparency={false}` to see the raw exported result.

No material colours, roughness or metalness are changed — those stay as
exported, ready for the configurator phase. There are also **no UVs**, so any
future texture work needs UVs generated or must stay solid-colour.

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
