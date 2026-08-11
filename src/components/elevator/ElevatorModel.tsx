import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Color, Mesh, MeshStandardMaterial, Vector3, type Material, type Object3D } from 'three';
import gsap from 'gsap';
import type { ElevatorConfiguration } from '../../types/elevator';
import { prefersReducedMotion } from '../../hooks/useScrollAnimation';
import { GLB_MATERIALS, resolveMaterialTargets } from './ElevatorMaterials';

export const ELEVATOR_MODEL_URL = '/models/vacuum-elevator-pve37.glb';

/**
 * Glazing materials in the GLB. The export names this one
 * "[Translucent Glass Gray]" but ships it with alphaMode OPAQUE and alpha 1.0 —
 * Blender drops blend settings unless the material is explicitly set to Blend.
 * Left untouched the tube renders as a solid pipe hiding the cab, so the viewer
 * opts it back into transparency. Pass `glassTransparency={false}` to see the raw
 * exported result.
 */
export const GLASS_MATERIAL_NAMES: string[] = [GLB_MATERIALS.glass];

export type ModelMetrics = {
  size: Vector3;
  height: number;
  footprint: number;
};

type Props = {
  url?: string;
  /** Drives the materials. Changes tween rather than snap. */
  config: ElevatorConfiguration;
  glassTransparency?: boolean;
  onMeasured?: (metrics: ModelMetrics) => void;
};

const isMesh = (o: Object3D): o is Mesh => (o as Mesh).isMesh === true;
const asArray = (m: Material | Material[]): Material[] => (Array.isArray(m) ? m : [m]);

const TWEEN = 0.5;

/**
 * The actual GLB, normalised for rendering and wired up for live configuration.
 *
 * Two corrections are applied at load, both forced by how the file was exported:
 *  - vertex normals are computed, because every primitive ships POSITION only
 *    and unlit geometry renders black;
 *  - glazing is made transparent again.
 *
 * Colours, metalness and roughness then come from configuration via
 * resolveMaterialTargets — the GLB's own values are the starting point, never
 * hardcoded here.
 */
export default function ElevatorModel({
  url = ELEVATOR_MODEL_URL,
  config,
  glassTransparency = true,
  onMeasured,
}: Props) {
  const { scene } = useGLTF(url);

  const { object, metrics, materialsByName, ownedMaterials } = useMemo(() => {
    const root = scene.clone(true);

    /**
     * One clone per *source* material, shared by every mesh that used it.
     *
     * Cloning per-mesh instead would produce ~41 copies of " frame color" and a
     * frame recolour would have to tween all of them. Sharing preserves the
     * grouping the GLB already expresses, while still never touching the cached
     * originals that useGLTF hands out.
     */
    const clones = new Map<Material, Material>();
    const byName = new Map<string, MeshStandardMaterial[]>();

    root.traverse((child) => {
      if (!isMesh(child)) return;

      // No NORMAL attribute in this export; without normals nothing shades.
      if (!child.geometry.getAttribute('normal')) child.geometry.computeVertexNormals();

      const next = asArray(child.material).map((source) => {
        let clone = clones.get(source);
        if (!clone) {
          clone = source.clone();
          clones.set(source, clone);

          if (clone instanceof MeshStandardMaterial) {
            const list = byName.get(source.name) ?? [];
            list.push(clone);
            byName.set(source.name, list);
          }

          if (glassTransparency && GLASS_MATERIAL_NAMES.includes(source.name) && clone instanceof MeshStandardMaterial) {
            clone.transparent = true;
            clone.depthWrite = false; // overlapping panes must not cull each other
            clone.needsUpdate = true;
          }
        }
        return clone;
      });

      child.material = Array.isArray(child.material) ? next : next[0];
      child.castShadow = true;
      child.receiveShadow = true;
    });

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    root.position.set(-center.x, -box.min.y, -center.z);

    return {
      object: root,
      metrics: { size, height: size.y, footprint: Math.max(size.x, size.z) } satisfies ModelMetrics,
      materialsByName: byName,
      ownedMaterials: [...clones.values()],
    };
  }, [scene, glassTransparency]);

  useEffect(() => {
    onMeasured?.(metrics);
  }, [metrics, onMeasured]);

  // Live configuration → real material properties, eased with GSAP.
  const first = useRef(true);
  useEffect(() => {
    const targets = resolveMaterialTargets(config);
    // Snap on the first pass so the model never appears in the wrong finish.
    const duration = first.current || prefersReducedMotion() ? 0 : TWEEN;
    first.current = false;

    const tweens: gsap.core.Tween[] = [];

    for (const [name, target] of Object.entries(targets)) {
      const materials = materialsByName.get(name);
      if (!materials?.length) continue;

      const rgb = new Color(target.color);

      for (const material of materials) {
        tweens.push(
          gsap.to(material.color, { r: rgb.r, g: rgb.g, b: rgb.b, duration, ease: 'power2.out', overwrite: 'auto' }),
        );
        tweens.push(
          gsap.to(material, {
            metalness: target.metalness,
            roughness: target.roughness,
            ...(target.opacity !== undefined ? { opacity: target.opacity } : {}),
            duration,
            ease: 'power2.out',
            overwrite: 'auto',
          }),
        );
      }
    }

    return () => tweens.forEach((t) => t.kill());
  }, [config, materialsByName]);

  // Geometries are shared with the GLTF cache, so only the clones are disposed.
  useEffect(() => () => ownedMaterials.forEach((m) => m.dispose()), [ownedMaterials]);

  return <primitive object={object} />;
}

useGLTF.preload(ELEVATOR_MODEL_URL);
