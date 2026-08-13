import { Color, Mesh, MeshStandardMaterial, type Material, type Object3D } from 'three';
import raw from '../../data/elevator_finishes.json';

/**
 * The finish library exported alongside rotunda_web.glb.
 *
 * The JSON is not a material map — its keys are `<Slot>_<Option>`, one entry per
 * *choice*, while the GLB carries one material per *slot*. Verified against the
 * export with `node scripts/inspect-glb.mjs public/models/rotunda_web.glb`:
 *
 *   GLB material          JSON options
 *   ────────────────────  ──────────────────────────────────────────
 *   Elevator_Frame        Black · Bronze · Champagne · Silver
 *   Elevator_Glass        Clear · Smoked
 *   Elevator_Interior     Dark · Walnut · Warm
 *   Elevator_Floor        (none yet)
 *   Elevator_Frame_Graphite (none yet — the shaft mullions)
 *
 * So this module indexes the library by slot rather than renaming anything. The
 * scroll scene only needs `SLOTS` to find the meshes it must not touch; the
 * Customize page can later read `finishOptions('Elevator_Frame')` and apply a
 * `FinishSpec` without any of this having to change.
 */

/** One entry of elevator_finishes.json, exactly as Blender wrote it. */
export type FinishSpec = {
  /** Linear-space RGB, 0–1, three entries. This is the authoritative colour —
      baseColorHex is the same value converted to sRGB for DOM swatches. */
  baseColorLinear: number[];
  /** sRGB hex of the same colour, for swatches in the DOM. */
  baseColorHex: string;
  metalness: number;
  roughness: number;
  opacity: number;
  transparent: boolean;
};

export const FINISHES = raw as Record<string, FinishSpec>;

/**
 * Material names as they appear in the GLB. Nothing here is guessed — changing
 * one of these strings silently disconnects a slot, so they are declared once.
 */
export const SLOTS = {
  frame: 'Elevator_Frame',
  frameGraphite: 'Elevator_Frame_Graphite',
  glass: 'Elevator_Glass',
  interior: 'Elevator_Interior',
  floor: 'Elevator_Floor',
} as const;

export type SlotName = (typeof SLOTS)[keyof typeof SLOTS];

/** A choice within a slot: the JSON key, its short label, and its values. */
export type FinishOption = { key: string; label: string; spec: FinishSpec };

/**
 * Every option the library offers for one slot, derived from the key prefix.
 * Returns [] for slots the export ships without alternatives, which is a real
 * answer — the caller should hide that control rather than invent options.
 */
export function finishOptions(slot: SlotName): FinishOption[] {
  const prefix = `${slot}_`;
  return Object.entries(FINISHES)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, spec]) => ({ key, label: key.slice(prefix.length), spec }));
}

/** Slot → options, built once. Handy for rendering a whole configurator. */
export const FINISH_LIBRARY: Record<SlotName, FinishOption[]> = Object.fromEntries(
  Object.values(SLOTS).map((slot) => [slot, finishOptions(slot)]),
) as Record<SlotName, FinishOption[]>;

/* ------------------------------------------------------- applying a finish -- */

/**
 * Every material in a loaded GLB grouped by slot name.
 *
 * One entry per *material instance*, because the export reuses a slot across
 * several meshes (frame, rings, mullions) and a finish change has to reach all
 * of them. Slots with no meshes are simply absent, which is how a caller learns
 * the export drifted.
 */
export function collectSlots(root: Object3D): Map<SlotName, MeshStandardMaterial[]> {
  const known = new Set<string>(Object.values(SLOTS));
  const found = new Map<SlotName, MeshStandardMaterial[]>();
  const seen = new Set<Material>();

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    for (const material of materials) {
      if (!material || seen.has(material)) continue;
      seen.add(material);
      if (!(material instanceof MeshStandardMaterial) || !known.has(material.name)) continue;

      const slot = material.name as SlotName;
      const list = found.get(slot) ?? [];
      list.push(material);
      found.set(slot, list);
    }
  });

  return found;
}

/**
 * Writes one library entry onto a slot's materials.
 *
 * Colour goes on in linear space directly — `baseColorLinear` is what Blender
 * exported, so converting through the hex would throw away precision for no
 * reason. Transparency is only ever turned *on* here; a slot the export shipped
 * blended stays blended, because its draw order depends on it.
 */
export function applyFinish(materials: MeshStandardMaterial[], spec: FinishSpec) {
  const [r, g, b] = spec.baseColorLinear;

  for (const material of materials) {
    material.color.copy(new Color().setRGB(r, g, b, 'srgb-linear'));
    material.metalness = spec.metalness;
    material.roughness = spec.roughness;
    material.opacity = spec.opacity;
    if (spec.transparent) material.transparent = true;
    material.needsUpdate = true;
  }
}
