import type { FinishFamily } from '../types/elevator';

export type Finish = {
  id: string;
  name: string;
  /** Swatch colour. Also used as the fallback tint before the render loads. */
  hex: string;
  family: FinishFamily;
  /** Pre-rendered cabin visual. Swap for .webp/.avif when photography arrives. */
  image: string;
};

export type FinishGroup = {
  id: FinishFamily;
  label: string;
  note: string;
  finishes: Finish[];
};

export const finishGroups: FinishGroup[] = [
  {
    id: 'standard',
    label: 'Standard',
    note: 'Solid architectural tones',
    finishes: [
      { id: 'white', name: 'White', hex: '#EDEDE9', family: 'standard', image: '/images/elevators/white.svg' },
      { id: 'black', name: 'Black', hex: '#16181C', family: 'standard', image: '/images/elevators/black.svg' },
      { id: 'grey', name: 'Grey', hex: '#8A8F98', family: 'standard', image: '/images/elevators/grey.svg' },
      { id: 'beige', name: 'Beige', hex: '#D8CBB6', family: 'standard', image: '/images/elevators/beige.svg' },
    ],
  },
  {
    id: 'textured',
    label: 'Textured',
    note: 'Matte finishes with surface depth',
    finishes: [
      { id: 'blue', name: 'Blue', hex: '#1F3A5F', family: 'textured', image: '/images/elevators/blue.svg' },
      { id: 'brown', name: 'Brown', hex: '#6B4A34', family: 'textured', image: '/images/elevators/brown.svg' },
      { id: 'green', name: 'Green', hex: '#2E4636', family: 'textured', image: '/images/elevators/green.svg' },
      { id: 'carbon', name: 'Carbon', hex: '#23262B', family: 'textured', image: '/images/elevators/carbon.svg' },
    ],
  },
  {
    id: 'metallic',
    label: 'Metallic',
    note: 'Reflective metal surfaces',
    finishes: [
      { id: 'silver', name: 'Silver', hex: '#C3C7CC', family: 'metallic', image: '/images/elevators/silver.svg' },
      { id: 'gold', name: 'Gold', hex: '#B9955A', family: 'metallic', image: '/images/elevators/gold.svg' },
      { id: 'bronze', name: 'Bronze', hex: '#8C6239', family: 'metallic', image: '/images/elevators/bronze.svg' },
    ],
  },
];

export const finishes: Finish[] = finishGroups.flatMap((g) => g.finishes);

export type Interior = {
  id: string;
  name: string;
  hex: string;
  /** Second tone used for the cabin floor / back wall pairing. */
  accent: string;
  note: string;
};

export const interiors: Interior[] = [
  { id: 'marble', name: 'Marble', hex: '#E8E6E1', accent: '#C9C6BF', note: 'Cool stone, high reflectance' },
  { id: 'wood', name: 'Wood', hex: '#8A5A33', accent: '#B98A5C', note: 'Warm grain, softer light' },
  { id: 'granite', name: 'Granite', hex: '#4A4E54', accent: '#6E747C', note: 'Deep speckle, low glare' },
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
export const findInterior = (id: string): Interior => interiors.find((i) => i.id === id) ?? interiors[0];
export const findLighting = (id: string): Lighting => lightingOptions.find((l) => l.id === id) ?? lightingOptions[0];
