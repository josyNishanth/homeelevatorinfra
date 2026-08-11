import type { ElevatorConfiguration } from '../../types/elevator';
import {
  findFinish,
  findGlass,
  findInterior,
  findLighting,
  type Finish,
  type Glass,
  type Interior,
  type Lighting,
} from '../../data/colors';

/**
 * Material names exactly as they appear in
 * public/models/vacuum-elevator-pve37.glb. Verified with
 * `node scripts/inspect-glb-materials.mjs` — not guessed.
 *
 *  " frame color"              41 primitives across 8 meshes — the whole frame,
 *                              rings, supports, cab plate, rails, door mullions.
 *                              NOTE the leading space in the name.
 *  "[Translucent Glass Gray]"   8 primitives — the tube glazing and door glass.
 *                              Exported OPAQUE despite the name.
 *  "base color"                 2 primitives — the flat cab floor plates
 *                              (localSize 0.83 x 0.00 x 0.83, i.e. discs).
 *  "DefaultMaterial"            2 primitives, 46 verts — the small door hardware
 *                              block. Left alone; too small to be a UI control.
 */
export const GLB_MATERIALS = {
  frame: ' frame color',
  glass: '[Translucent Glass Gray]',
  floor: 'base color',
  hardware: 'DefaultMaterial',
} as const;

/** Target values for one PBR material, resolved from configuration. */
export type MaterialTarget = {
  color: string;
  metalness: number;
  roughness: number;
  /** Only set for glazing. */
  opacity?: number;
  transparent?: boolean;
};

/**
 * Configuration → real three.js material values. ElevatorModel tweens towards
 * whatever this returns; it is the only translation layer between UI state and
 * the GLB's materials.
 */
export function resolveMaterialTargets(config: ElevatorConfiguration): Record<string, MaterialTarget> {
  const finish = findFinish(config.exteriorColor);
  const glass = findGlass(config.glass);
  const interior = findInterior(config.interior);

  return {
    [GLB_MATERIALS.frame]: {
      color: finish.hex,
      metalness: finish.metalness,
      roughness: finish.roughness,
    },
    [GLB_MATERIALS.glass]: {
      color: glass.hex,
      metalness: 0,
      roughness: glass.roughness,
      opacity: glass.opacity,
      transparent: true,
    },
    [GLB_MATERIALS.floor]: {
      color: interior.hex,
      metalness: interior.metalness,
      roughness: interior.roughness,
    },
  };
}

/**
 * The only place that turns configuration into appearance.
 *
 * Today it returns an image source plus CSS variables for the interior and
 * lighting overlays. When the Three.js viewer lands, this same function returns
 * material parameters (colour, roughness, metalness, light temperature) and
 * nothing else in the UI has to change.
 */
export type MaterialSet = {
  finish: Finish;
  glass: Glass;
  interior: Interior;
  lighting: Lighting;
  /** Pre-rendered cabin visual for the selected exterior finish. */
  image: string;
  /** Applied to the viewer shell; consumed by the overlay layers. */
  vars: Record<string, string>;
};

const FAMILY_SHEEN: Record<string, number> = {
  standard: 0.16,
  textured: 0.08,
  metallic: 0.3,
};

export function resolveMaterials(config: ElevatorConfiguration): MaterialSet {
  const finish = findFinish(config.exteriorColor);
  const glass = findGlass(config.glass);
  const interior = findInterior(config.interior);
  const lighting = findLighting(config.lighting);

  return {
    finish,
    glass,
    interior,
    lighting,
    image: finish.image,
    vars: {
      '--finish': finish.hex,
      '--interior': interior.hex,
      '--interior-accent': interior.accent,
      '--lighting': lighting.hex,
      '--sheen': String(FAMILY_SHEEN[config.texture] ?? 0.14),
      // Premium lighting layers a cove wash over the downlight.
      '--light-strength': config.lighting === 'premium' ? '0.34' : config.lighting === 'warm' ? '0.26' : '0.18',
    },
  };
}
