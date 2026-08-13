import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  AnimationMixer,
  MathUtils,
  Mesh,
  NeutralToneMapping,
  PMREMGenerator,
  type AnimationClip,
  type Group,
  type Light,
  type Material,
  type MeshStandardMaterial,
  type Object3D,
  type PerspectiveCamera,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SLOTS, collectSlots } from './rotundaFinishes';

/**
 * The rotunda, driven by page scroll.
 *
 * Everything here reads the export rather than restating it: the camera is the
 * GLB's own WEB_SCROLL_CAMERA, the path is its baked animation clip, and the six
 * exported lights come in through KHR_lights_punctual untouched. Scroll only
 * decides *when* along the clip we are — never where the camera goes.
 *
 * This module is the lazy chunk. Nothing above it imports three.js, so the rest
 * of the home page ships without it.
 */

/** Instanced first: 86 nodes against 444, and 362 fewer draw calls. */
export const ROTUNDA_INSTANCED = '/models/rotunda_web_instanced.glb';
/** Same scene, same camera, same clip — flat node graph. Used if the first fails. */
export const ROTUNDA_PLAIN = '/models/rotunda_web.glb';

const CAMERA_NODE = 'WEB_SCROLL_CAMERA';

/** The aspect the shot was framed for (glTF camera aspectRatio). */
const DESIGN_ASPECT = 1.6;
/**
 * Ceiling on the portrait FOV compensation below. An interior at 85° reads as a
 * wide architectural lens; past that it reads as a fisheye and the columns bow.
 */
const MAX_FOV = 85;

/** Scroll → camera easing. Higher converges faster; 4.5 settles in ~0.25s. */
const DAMP = 4.5;

/**
 * Watts back out of candela.
 *
 * Blender's glTF exporter converts light power to candela through the
 * luminous-efficacy constant, 683 lm/W. three.js reads those candela as raw
 * shader units and never divides it back out, so the six exported lights arrive
 * roughly three orders of magnitude too strong: summed at the cab they come to
 * ~10,200, where linear 1.0 is already white. That is the whole reason the shot
 * rendered as a white maquette — no tone mapper recovers from 10,000× over.
 *
 * Dividing by the same constant restores the artist's exposure while leaving the
 * *balance* between key, fills and sun exactly as it was authored.
 */
const LIGHT_SCALE = 1 / 683;

/**
 * RoomEnvironment is a reflection source, not a light. It is also a *white*
 * room, so overspending here bleaches colour back out of the stone. This much
 * gives the gold and bronze something to reflect and no more.
 */
const ENV_INTENSITY = 0.4;

/**
 * Colour grade for the architecture.
 *
 * Three materials — Warm_Ivory_Marble, Wood_Door and Floor_Marble — ship with no
 * baseColorFactor and no texture, verified against the export. In glTF that
 * means pure white, which is why the rotunda renders paler than the Blender
 * frames in 3D-model/_pathcheck: their colour lived in procedural node graphs
 * that glTF cannot carry. The rest of the entries pull the ivories off white and
 * push the gold towards the brand's, so the shot reads as warm stone and metal
 * rather than a white maquette.
 *
 * Architecture only. Every Elevator_* slot is left exactly as exported, because
 * those belong to the finish library and the Customize page drives them.
 */
const GRADE: Record<string, string> = {
  Floor_Marble: '#232C3D', // deep navy marble — roughness 0.16, so it mirrors the gold
  Warm_Ivory_Marble: '#D6C9AE', // warm limestone
  Wood_Door: '#4A3324', // dark walnut
  Ceiling_Ivory_Plaster: '#C7B99C', // plaster, not paper
  Stone_Tread_Ivory: '#CDBFA4', // stair treads
  Champagne_Gold: '#C9A45C', // richer than the export's pale champagne
};

/**
 * Sky and ground for the ambient wrap. Gold from the oculus, navy from the
 * floor: the shadows pick up the brand's blue instead of going neutral grey,
 * which is what stops a bright interior from reading as flat and white.
 */
const AMBIENT_SKY = '#FFE7BE';
const AMBIENT_GROUND = '#0E1E3A';
const AMBIENT_INTENSITY = 1.2;

/* -------------------------------------------------- hoisted canvas props ---
   These must never be fresh literals. R3F compares them by reference, so a
   re-render with a new object re-applies the camera prop over the animated
   GLB camera and resets the FOV compensation mid-scroll. */

const DPR_DESKTOP: [number, number] = [1, 2];
const DPR_MOBILE: [number, number] = [1, 1.5];

const GL_DESKTOP = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
  /**
   * Khronos PBR Neutral, not R3F's default ACES. ACES is a film curve: it pushes
   * bright values towards white as they climb, which on a lit stone interior is
   * exactly the wash this section had. Neutral was written for product and
   * architecture viewers — it holds hue and saturation into the highlights, so
   * the gold stays gold at the oculus instead of going to paper.
   */
  toneMapping: NeutralToneMapping,
  /** The one exposure knob. Lower darkens the whole scene. */
  toneMappingExposure: 1,
};
const GL_MOBILE = { ...GL_DESKTOP, antialias: false };

/** Only what R3F needs before the GLB's own camera takes over. */
const CAMERA_INIT = { fov: 50, near: 0.05, far: 120 };

/* ------------------------------------------------------------- disposal ---- */

/** Frees the GPU side of a loaded GLB. R3F never disposes <primitive> objects,
    because it did not create them, so the section has to do it itself. */
function disposeScene(root: Object3D) {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    mesh.geometry?.dispose();
    const materials: Material[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) material?.dispose();
  });
}

/* ------------------------------------------------------------ camera rig --- */

type RigProps = {
  scene: Group;
  clip: AnimationClip;
  /** Raw scroll progress 0→1, written by the section shell every scroll frame. */
  progress: MutableRefObject<number>;
  reduced: boolean;
};

/**
 * Binds the clip to scroll and makes the GLB's camera the one we render through.
 *
 * The scroll value is never applied directly. It is damped towards each frame,
 * which is what turns a stepped wheel event into a continuous dolly and what
 * makes the camera coast to a stop instead of stopping dead.
 */
function CameraRig({ scene, clip, progress, reduced }: RigProps) {
  const set = useThree((s) => s.set);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  const camera = useMemo(() => {
    const found = scene.getObjectByName(CAMERA_NODE);
    if (!found) throw new Error(`[RotundaCanvas] ${CAMERA_NODE} is missing from the GLB`);
    return found as PerspectiveCamera;
  }, [scene]);

  // The exported vertical FOV, before any viewport compensation.
  const designFov = useRef(camera.fov);

  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const eased = useRef(0);

  // Scrubbing means we drive time by hand; the action is only ever "playing" so
  // that the mixer evaluates it.
  useEffect(() => {
    const action = mixer.clipAction(clip);
    action.play();
    // Clip time never reaches the very end, so LoopRepeat can never wrap the
    // camera back to the first frame on the last pixel of the section.
    mixer.setTime(0);
    return () => {
      mixer.stopAllAction();
      mixer.uncacheClip(clip);
    };
  }, [mixer, clip]);

  useLayoutEffect(() => {
    set({ camera });
    // R3F skips its own resize handling for a camera flagged manual, which is
    // what we want — the compensation below is not the plain viewport aspect.
    // The flag is real (fiber checks `camera.manual`) but undeclared in three's
    // types, hence the narrowing rather than a blanket cast.
    (camera as PerspectiveCamera & { manual?: boolean }).manual = true;
  }, [set, camera]);

  /**
   * Portrait viewports are far narrower than the 16:10 the shot was framed for.
   * Left alone, a fixed vertical FOV would crop the rotunda to a slot and the
   * elevator would fall outside the frame. Widening the vertical angle until the
   * *horizontal* extent matches the design keeps the composition the animator
   * built, up to the fisheye ceiling.
   */
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    camera.aspect = aspect;

    if (aspect < DESIGN_ASPECT) {
      const halfWidth = Math.tan(MathUtils.degToRad(designFov.current) / 2) * DESIGN_ASPECT;
      const widened = MathUtils.radToDeg(2 * Math.atan(halfWidth / aspect));
      camera.fov = Math.min(widened, MAX_FOV);
    } else {
      camera.fov = designFov.current;
    }

    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);

  // Reduced motion: park on the opening composition and render once. No ticker,
  // no scroll binding, no camera movement at all.
  useEffect(() => {
    if (!reduced) return;
    mixer.setTime(0);
    invalidate();
  }, [reduced, mixer, invalidate]);

  useFrame((_, delta) => {
    if (reduced) return;
    eased.current = MathUtils.damp(eased.current, progress.current, DAMP, delta);
    // A hair short of the end: at exactly the clip duration the mixer wraps.
    mixer.setTime(MathUtils.clamp(eased.current, 0, 1) * (clip.duration - 1e-4));
  });

  return <primitive object={scene} />;
}

/* ----------------------------------------------------------- environment --- */

/**
 * Procedural room reflections for the gold, bronze and dark metal. Generated on
 * the GPU from three's own RoomEnvironment, so it costs no download and there is
 * no HDR to fetch.
 */
function RoomReflections() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);

    scene.environment = target.texture;
    scene.environmentIntensity = ENV_INTENSITY;

    room.dispose();
    pmrem.dispose();

    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* ------------------------------------------------------------ the model ---- */

type ModelProps = { url: string; onReady: () => void } & Omit<RigProps, 'scene' | 'clip'>;

function Rotunda({ url, onReady, progress, reduced }: ModelProps) {
  const { scene, animations } = useGLTF(url);
  const clip = animations[0];
  if (!clip) throw new Error(`[RotundaCanvas] ${url} carries no camera animation`);

  // The shell puts up its own loader; three.js is inside this chunk, so telling
  // it we have arrived is cheaper than making it import drei's progress store.
  useEffect(onReady, [onReady]);

  /**
   * The configurable materials, grouped by slot. This scene renders them exactly
   * as exported — the index exists so the Customize page can drive them later,
   * and so a renamed material in a future export is caught here rather than
   * discovered as a control that silently does nothing.
   */
  useEffect(() => {
    const slots = collectSlots(scene);
    if (!import.meta.env.DEV) return;
    const missing = Object.values(SLOTS).filter((slot) => !slots.has(slot));
    if (missing.length) {
      console.warn(`[RotundaCanvas] ${url} has no meshes for slot(s): ${missing.join(', ')}`);
    }
  }, [scene, url]);

  /**
   * Exposure and colour, both of which the GLB cannot carry on its own. Flagged
   * on the scene because the loader caches it: without the guard a remount would
   * scale the lights a second time and black the room out.
   */
  useEffect(() => {
    if (scene.userData.graded) return;
    scene.userData.graded = true;

    const graded = new Set<Material>();

    scene.traverse((child) => {
      if ((child as Light).isLight) {
        (child as Light).intensity *= LIGHT_SCALE;
        return;
      }
      if (!(child as Mesh).isMesh) return;

      const mesh = child as Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      for (const material of materials) {
        const hex = material && GRADE[material.name];
        if (!hex || graded.has(material)) continue;
        graded.add(material);
        (material as MeshStandardMaterial).color.set(hex);
      }
    });
  }, [scene]);

  // The section owns these resources for the life of the page; when it goes, so
  // do they. Clearing the cache alongside the dispose keeps a remount honest —
  // it re-reads the file rather than re-using buffers we just freed.
  useEffect(
    () => () => {
      disposeScene(scene);
      useGLTF.clear(url);
    },
    [scene, url],
  );

  return (
    <>
      {/* Colour in the ambient wrap rather than a neutral lift: gold from the
          oculus above, the brand's navy bouncing off the floor. The exported six
          lights still do all the shaping — this only decides what colour the
          places they miss are. */}
      <hemisphereLight args={[AMBIENT_SKY, AMBIENT_GROUND, AMBIENT_INTENSITY]} />
      <CameraRig scene={scene as Group} clip={clip} progress={progress} reduced={reduced} />
    </>
  );
}

/* -------------------------------------------------------------- fallback --- */

type BoundaryProps = { children: ReactNode; onError: (error: unknown) => void };

/** Catches a failed GLB so the canvas can retry with the flat export. */
class LoadBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ---------------------------------------------------------------- canvas --- */

type Props = {
  progress: MutableRefObject<number>;
  /** Render only while the section is on screen. */
  active: boolean;
  reduced: boolean;
  /** Both exports failed — the shell should show the still frame instead. */
  onFailed: () => void;
  /** The model is on screen; the shell can drop its loader. */
  onReady: () => void;
  /** Coarse pointer / small screen: render at a lower ceiling. */
  mobile: boolean;
};

export default function RotundaCanvas({ progress, active, reduced, onFailed, onReady, mobile }: Props) {
  const [url, setUrl] = useState(ROTUNDA_INSTANCED);

  const handleError = (error: unknown) => {
    if (url === ROTUNDA_INSTANCED) {
      console.warn('[RotundaCanvas] instanced export failed; falling back to the flat one:', error);
      setUrl(ROTUNDA_PLAIN);
      return;
    }
    console.error('[RotundaCanvas] both exports failed; showing the still frame:', error);
    onFailed();
  };

  return (
    <Canvas
      // Pixel ratio is the first thing to give up on a phone — resolution costs
      // fill rate, and this scene is heavy on transparency.
      dpr={mobile ? DPR_MOBILE : DPR_DESKTOP}
      // Off screen, the ticker stops entirely rather than idling.
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      gl={mobile ? GL_MOBILE : GL_DESKTOP}
      // The GLB brings its own camera; this is only what R3F starts with.
      camera={CAMERA_INIT}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <LoadBoundary key={url} onError={handleError}>
          <RoomReflections />
          <Rotunda url={url} onReady={onReady} progress={progress} reduced={reduced} />
        </LoadBoundary>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(ROTUNDA_INSTANCED);
