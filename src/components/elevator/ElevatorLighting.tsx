import { useEffect, useRef } from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import type { AmbientLight, DirectionalLight, PointLight } from 'three';
import { Color } from 'three';
import gsap from 'gsap';
import { prefersReducedMotion } from '../../hooks/useScrollAnimation';

/**
 * Real lighting presets. These change three.js lights — colour temperature,
 * intensity and which fixtures are active — rather than tinting the image.
 *
 *  warm     — 2700K key and fill, softer, no cool rim. Visibly amber.
 *  neutral  — white across the board, nothing tinted. True-to-finish.
 *  premium  — layered: neutral key + cool rim + a warm point light inside the
 *             cab, so the cabin glows from within and the frame gets separation.
 */
export type LightingPreset = {
  ambient: { color: string; intensity: number };
  key: { color: string; intensity: number };
  fill: { color: string; intensity: number };
  rim: { color: string; intensity: number };
  /** Interior fixture inside the cab. Intensity 0 turns it off. */
  cabin: { color: string; intensity: number };
  envIntensity: number;
};

export const LIGHTING_PRESETS: Record<string, LightingPreset> = {
  warm: {
    ambient: { color: '#FFE2BC', intensity: 0.3 },
    key: { color: '#FFD9A6', intensity: 1.55 },
    fill: { color: '#FFE8CC', intensity: 0.45 },
    rim: { color: '#FFCE93', intensity: 0.5 },
    cabin: { color: '#FFB863', intensity: 1.1 },
    envIntensity: 0.75,
  },
  neutral: {
    ambient: { color: '#FFFFFF', intensity: 0.32 },
    key: { color: '#FFFFFF', intensity: 1.5 },
    fill: { color: '#F4F6F8', intensity: 0.5 },
    rim: { color: '#FFFFFF', intensity: 0.55 },
    cabin: { color: '#FFFFFF', intensity: 0.35 },
    envIntensity: 1,
  },
  premium: {
    ambient: { color: '#EFF4FA', intensity: 0.22 },
    key: { color: '#FFFFFF', intensity: 1.7 },
    fill: { color: '#E8EFF7', intensity: 0.34 },
    rim: { color: '#BFD8F5', intensity: 1.35 },
    cabin: { color: '#FFD9A0', intensity: 1.5 },
    envIntensity: 1.15,
  },
};

type Props = {
  /** Lighting option id from src/data/colors.ts. */
  preset?: string;
  groundY?: number;
  footprint?: number;
  height?: number;
};

const TWEEN = 0.5;

/** Eases a light towards a preset entry instead of snapping. */
function useLightTween(
  ref: React.RefObject<(AmbientLight | DirectionalLight | PointLight) | null>,
  target: { color: string; intensity: number },
  first: React.MutableRefObject<boolean>,
) {
  useEffect(() => {
    const light = ref.current;
    if (!light) return;
    const duration = first.current || prefersReducedMotion() ? 0 : TWEEN;
    const rgb = new Color(target.color);

    const a = gsap.to(light.color, { r: rgb.r, g: rgb.g, b: rgb.b, duration, ease: 'power2.out', overwrite: 'auto' });
    const b = gsap.to(light, { intensity: target.intensity, duration, ease: 'power2.out', overwrite: 'auto' });
    return () => {
      a.kill();
      b.kill();
    };
  }, [ref, target.color, target.intensity, first]);
}

export default function ElevatorLighting({ preset = 'premium', groundY = 0, footprint = 1.2, height = 5.5 }: Props) {
  const p = LIGHTING_PRESETS[preset] ?? LIGHTING_PRESETS.neutral;

  const ambient = useRef<AmbientLight>(null);
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);
  const cabin = useRef<PointLight>(null);

  // Snap on the first pass, ease on every change after it.
  const first = useRef(true);
  useEffect(() => {
    const id = window.setTimeout(() => {
      first.current = false;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useLightTween(ambient, p.ambient, first);
  useLightTween(key, p.key, first);
  useLightTween(fill, p.fill, first);
  useLightTween(rim, p.rim, first);
  useLightTween(cabin, p.cabin, first);

  return (
    <>
      {/* The GLB's " frame color" material has no baseColorFactor, so it is pure
          white. Total light stays low — overlighting a white object clips every
          channel to 1.0 and the form disappears. */}
      <ambientLight ref={ambient} intensity={p.ambient.intensity} />

      {/* Key — defines the form. */}
      <directionalLight ref={key} position={[footprint * 4, height * 1.5, footprint * 5]} intensity={p.key.intensity} />

      {/* Fill — lifts the shadow side so nothing reads as black. */}
      <directionalLight ref={fill} position={[-footprint * 5, height * 0.6, footprint * 3]} intensity={p.fill.intensity} />

      {/* Rim — separates the frame from the background. */}
      <directionalLight ref={rim} position={[-footprint * 2, height * 1.1, -footprint * 5]} intensity={p.rim.intensity} />

      {/* Cabin fixture — sits inside the tube at cab height, so the glazing and
          floor plate catch it. This is what makes "premium" read as layered. */}
      <pointLight
        ref={cabin}
        position={[0, height * 0.42, 0]}
        intensity={p.cabin.intensity}
        distance={height * 0.9}
        decay={1.4}
      />

      {/* Reflections. background={false} keeps it out of frame — it only lights. */}
      <Environment resolution={256} frames={1} background={false} environmentIntensity={p.envIntensity}>
        <Lightformer form="rect" intensity={2} position={[0, height * 1.4, height * 0.5]} scale={[8, 8, 1]} />
        <Lightformer form="rect" intensity={0.7} position={[-height, height * 0.6, 0]} scale={[4, 10, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.95} position={[height, height * 0.6, 0]} scale={[4, 10, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.5} position={[0, height * 0.3, -height]} scale={[8, 8, 1]} rotation-y={Math.PI} />
      </Environment>

      {/* Soft ground contact instead of shadow maps: no harsh edges, cheaper. */}
      <ContactShadows
        position={[0, groundY + 0.002, 0]}
        scale={Math.max(footprint * 5, 6)}
        resolution={1024}
        far={height * 0.4}
        blur={2.8}
        opacity={0.42}
        color="#2b2f36"
      />
    </>
  );
}
