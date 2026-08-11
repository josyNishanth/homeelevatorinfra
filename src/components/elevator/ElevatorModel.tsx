import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Mesh, MeshStandardMaterial, Vector3, type Material, type Object3D } from 'three';

export const ELEVATOR_MODEL_URL = '/models/vacuum-elevator-pve37.glb';

/**
 * Materials in the GLB that represent glazing.
 *
 * The exported material is named "[Translucent Glass Gray]" but carries
 * alphaMode OPAQUE and baseColorFactor alpha 1.0 — Blender's exporter drops
 * blend settings unless the material is explicitly set to Blend. Left untouched
 * the tube renders as a solid grey pipe that hides the cab inside it, so the
 * viewer opts these materials back into transparency. Set
 * `glassTransparency={false}` on the viewer to see the raw exported result.
 */
export const GLASS_MATERIAL_NAMES = ['[Translucent Glass Gray]'];

export type ModelMetrics = {
  /** Bounding-box size in model units. */
  size: Vector3;
  /** Height of the model, i.e. size.y. */
  height: number;
  /** Largest horizontal dimension. */
  footprint: number;
};

type Props = {
  url?: string;
  glassTransparency?: boolean;
  /** Fires once the model is loaded and measured. */
  onMeasured?: (metrics: ModelMetrics) => void;
};

const isMesh = (o: Object3D): o is Mesh => (o as Mesh).isMesh === true;
const asArray = (m: Material | Material[]): Material[] => (Array.isArray(m) ? m : [m]);

/**
 * The actual GLB, normalised for rendering but not restyled.
 *
 * Two corrections are applied, both documented above:
 *  - vertex normals are computed, because every primitive in this export ships
 *    POSITION only and unlit geometry renders black;
 *  - glazing materials are made transparent again.
 *
 * Nothing else about the materials is altered — colours, roughness and metalness
 * come straight from the file, ready for the configurator phase.
 */
export default function ElevatorModel({
  url = ELEVATOR_MODEL_URL,
  glassTransparency = true,
  onMeasured,
}: Props) {
  const { scene } = useGLTF(url);

  const { object, metrics, ownedMaterials } = useMemo(() => {
    // Clone so the cached GLTF is never mutated and remounts stay clean.
    const root = scene.clone(true);
    const owned: Material[] = [];

    root.traverse((child) => {
      if (!isMesh(child)) return;

      // This export has no NORMAL attribute; without normals nothing shades.
      if (!child.geometry.getAttribute('normal')) child.geometry.computeVertexNormals();

      // Own our materials so the configurator can recolour without touching the
      // shared cache entry.
      const cloned = asArray(child.material).map((material) => {
        const copy = material.clone();
        owned.push(copy);

        if (glassTransparency && GLASS_MATERIAL_NAMES.includes(material.name) && copy instanceof MeshStandardMaterial) {
          copy.transparent = true;
          copy.opacity = 0.26;
          copy.roughness = 0.06;
          copy.metalness = 0;
          copy.envMapIntensity = 1.6;
          // Glazing overlaps itself (two tube sections plus doors); skipping the
          // depth write stops the panes from culling each other.
          copy.depthWrite = false;
        }
        return copy;
      });

      child.material = Array.isArray(child.material) ? cloned : cloned[0];
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Measure, then park the model centred on X/Z with its base at y = 0, so the
    // camera and the contact shadow can both work from known numbers.
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    root.position.set(-center.x, -box.min.y, -center.z);

    return {
      object: root,
      metrics: { size, height: size.y, footprint: Math.max(size.x, size.z) } satisfies ModelMetrics,
      ownedMaterials: owned,
    };
  }, [scene, glassTransparency]);

  useEffect(() => {
    onMeasured?.(metrics);
  }, [metrics, onMeasured]);

  // Geometries are shared with the GLTF cache, so only the clones are disposed.
  useEffect(() => () => ownedMaterials.forEach((m) => m.dispose()), [ownedMaterials]);

  return <primitive object={object} />;
}

useGLTF.preload(ELEVATOR_MODEL_URL);
