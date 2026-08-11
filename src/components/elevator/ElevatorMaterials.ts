import type { ElevatorConfiguration } from '../../types/elevator';
import { findFinish, findInterior, findLighting, type Finish, type Interior, type Lighting } from '../../data/colors';

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
  const interior = findInterior(config.interior);
  const lighting = findLighting(config.lighting);

  return {
    finish,
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
