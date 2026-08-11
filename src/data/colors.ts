import type { FinishFamily } from '../types/elevator';

export type Finish = {
  id: string;
  name: string;
  /** Swatch colour, and the base colour applied to the 3D frame material. */
  hex: string;
  family: FinishFamily;
  /** Pre-rendered cabin visual. Swap for .webp/.avif when photography arrives. */
  image: string;
  /**
   * Real PBR values for the GLB's " frame color" material. A metallic finish is
   * not a yellow-ish colour — it is high metalness with low roughness, so the
   * environment does the work. Painted finishes are dielectric; textured ones
   * are matte.
   */
  metalness: number;
  roughness: number;
};

/** Per-family defaults, so a new finish only has to override what differs. */
const FAMILY_PBR: Record<FinishFamily, { metalness: number; roughness: number }> = {
  standard: { metalness: 0.08, roughness: 0.42 },
  textured: { metalness: 0.02, roughness: 0.78 },
  metallic: { metalness: 0.95, roughness: 0.24 },
};

export type FinishGroup = {
  id: FinishFamily;
  label: string;
  note: string;
  finishes: Finish[];
};

/** A finish before family PBR defaults are filled in. */
type FinishSeed = Omit<Finish, 'metalness' | 'roughness' | 'image'> &
  Partial<Pick<Finish, 'metalness' | 'roughness'>>;

const seed = (family: FinishFamily, list: FinishSeed[]): Finish[] =>
  list.map((f) => ({
    ...FAMILY_PBR[family],
    ...f,
    image: `/images/elevators/${f.id}.svg`,
  }));

export const finishGroups: FinishGroup[] = [
  {
    id: 'standard',
    label: 'Standard',
    note: 'Solid architectural tones',
    finishes: seed('standard', [
      { id: 'white', name: 'White', hex: '#EDEDE9', family: 'standard', roughness: 0.5 },
      { id: 'black', name: 'Black', hex: '#16181C', family: 'standard', roughness: 0.34 },
      { id: 'grey', name: 'Grey', hex: '#8A8F98', family: 'standard' },
      { id: 'beige', name: 'Beige', hex: '#D8CBB6', family: 'standard', roughness: 0.5 },
    ]),
  },
  {
    id: 'textured',
    label: 'Textured',
    note: 'Matte finishes with surface depth',
    finishes: seed('textured', [
      { id: 'blue', name: 'Blue', hex: '#1F3A5F', family: 'textured' },
      { id: 'brown', name: 'Brown', hex: '#6B4A34', family: 'textured' },
      { id: 'green', name: 'Green', hex: '#2E4636', family: 'textured' },
      { id: 'carbon', name: 'Carbon', hex: '#23262B', family: 'textured', roughness: 0.85 },
    ]),
  },
  {
    id: 'metallic',
    label: 'Metallic',
    note: 'Reflective metal surfaces',
    finishes: seed('metallic', [
      // Real metals: metalness 1 and low roughness, so the environment supplies
      // the highlights. Gold is gold because it reflects, not because it is yellow.
      { id: 'silver', name: 'Silver', hex: '#C3C7CC', family: 'metallic', metalness: 1, roughness: 0.14 },
      { id: 'gold', name: 'Gold', hex: '#B9955A', family: 'metallic', metalness: 1, roughness: 0.18 },
      { id: 'bronze', name: 'Bronze', hex: '#8C6239', family: 'metallic', metalness: 1, roughness: 0.3 },
    ]),
  },
];

export const finishes: Finish[] = finishGroups.flatMap((g) => g.finishes);

/**
 * Glazing options for the GLB's "[Translucent Glass Gray]" material.
 * The export ships it opaque, so the viewer re-enables transparency (see
 * ElevatorModel); these presets then tint and tune it.
 */
export type Glass = {
  id: string;
  name: string;
  /** Swatch + material colour. */
  hex: string;
  opacity: number;
  roughness: number;
  note: string;
};

export const glassOptions: Glass[] = [
  { id: 'clear', name: 'Clear', hex: '#DCE6F0', opacity: 0.18, roughness: 0.04, note: 'Maximum visibility' },
  { id: 'smoke', name: 'Smoke', hex: '#3A3F47', opacity: 0.44, roughness: 0.1, note: 'Tinted grey privacy' },
  { id: 'bronze', name: 'Bronze', hex: '#7A5A36', opacity: 0.4, roughness: 0.12, note: 'Warm tinted glazing' },
  { id: 'blue', name: 'Blue', hex: '#2C4A6B', opacity: 0.38, roughness: 0.08, note: 'Cool tinted glazing' },
];

export type Interior = {
  id: string;
  name: string;
  hex: string;
  /** Second tone used for the cabin floor / back wall pairing. */
  accent: string;
  note: string;
  /** PBR values applied to the floor plates in 3D. */
  roughness: number;
  metalness: number;
};

/**
 * Interior finishes. In 3D these drive the GLB's "base color" material, which is
 * the two flat cab floor plates — the only interior surface the export separates.
 * With no UVs in the model these render as solid tones, not stone/grain patterns;
 * see README for what the GLB needs for real materials.
 */
export const interiors: Interior[] = [
  { id: 'marble', name: 'Marble', hex: '#E8E6E1', accent: '#C9C6BF', note: 'Cool stone, high reflectance', roughness: 0.18, metalness: 0.02 },
  { id: 'wood', name: 'Wood', hex: '#8A5A33', accent: '#B98A5C', note: 'Warm grain, softer light', roughness: 0.62, metalness: 0 },
  { id: 'granite', name: 'Granite', hex: '#4A4E54', accent: '#6E747C', note: 'Deep speckle, low glare', roughness: 0.45, metalness: 0.04 },
];

export type Lighting = {
  id: string;
  name: string;
  hex: string;
  /** Perceived colour temperature, used for the cabin light overlay. */
  kelvin: string;
  note: string;
};

export const lightingOptions: Lighting[] = [
  { id: 'warm', name: 'Warm', hex: '#F0C88A', kelvin: '2700K', note: 'Living-room warmth' },
  { id: 'neutral', name: 'Neutral', hex: '#F2F3F5', kelvin: '4000K', note: 'True-to-finish clarity' },
  { id: 'premium', name: 'Premium', hex: '#E8D6AE', kelvin: '3000K', note: 'Layered cove and downlight' },
];

export const findFinish = (id: string): Finish => finishes.find((f) => f.id === id) ?? finishes[0];
export const findGlass = (id: string): Glass => glassOptions.find((g) => g.id === id) ?? glassOptions[0];
export const findInterior = (id: string): Interior => interiors.find((i) => i.id === id) ?? interiors[0];
export const findLighting = (id: string): Lighting => lightingOptions.find((l) => l.id === id) ?? lightingOptions[0];
