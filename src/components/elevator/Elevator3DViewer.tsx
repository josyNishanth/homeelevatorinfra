import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentRef, ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useProgress } from '@react-three/drei';
import { MathUtils, type PerspectiveCamera } from 'three';
import { RotateCw } from 'lucide-react';
import type { ElevatorConfiguration } from '../../types/elevator';
import { prefersReducedMotion } from '../../hooks/useScrollAnimation';
import ElevatorLighting from './ElevatorLighting';
import ElevatorModel, { ELEVATOR_MODEL_URL, type ModelMetrics } from './ElevatorModel';

type ControlsRef = ComponentRef<typeof OrbitControls>;

/* ------------------------------------------------------------ camera fit ---- */

type FitProps = {
  metrics: ModelMetrics;
  controls: ControlsRef | null;
  /** Once the visitor has taken control, never re-frame — that would yank the
      camera out from under them mid-orbit. */
  locked: boolean;
};

/**
 * Frames the model from its measured bounding box — no hardcoded distances.
 *
 * The model arrives centred on X/Z with its base at y = 0, so the target is
 * simply half its height. Distance is solved for both the vertical and the
 * horizontal fit and the larger wins, which is what guarantees the whole
 * elevator stays in frame on a narrow phone as well as a wide desktop.
 */
function FitCamera({ metrics, controls, locked }: FitProps) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const lastAspect = useRef<number | null>(null);

  useEffect(() => {
    if (!height || !width || locked) return;
    const aspect = width / height;

    // Refit on first run and on real layout changes (device rotation), but not
    // for the small height jitter a mobile URL bar causes — that would yank the
    // camera back while someone is mid-orbit.
    const previous = lastAspect.current;
    if (previous !== null && Math.abs(aspect - previous) / previous < 0.15) return;
    lastAspect.current = aspect;

    // Fill fraction: the brief asks for 65–75% of viewer height, with a little
    // more breathing room on small screens.
    const fill = width < 640 ? 0.66 : 0.72;
    const fovRad = camera.fov * MathUtils.DEG2RAD;
    const halfTan = Math.tan(fovRad / 2);

    const distForHeight = metrics.size.y / fill / (2 * halfTan);
    const distForWidth = metrics.size.x / fill / (2 * halfTan * aspect);
    const distance = Math.max(distForHeight, distForWidth);

    const centerY = metrics.size.y / 2;
    const azimuth = 28 * MathUtils.DEG2RAD;
    const elevation = 7 * MathUtils.DEG2RAD;
    const horizontal = distance * Math.cos(elevation);

    camera.position.set(
      Math.sin(azimuth) * horizontal,
      centerY + distance * Math.sin(elevation),
      Math.cos(azimuth) * horizontal,
    );
    camera.near = Math.max(0.01, distance * 0.02);
    camera.far = distance * 8;
    camera.updateProjectionMatrix();
    camera.lookAt(0, centerY, 0);

    if (controls) {
      controls.target.set(0, centerY, 0);
      controls.minDistance = distance * 0.5;
      controls.maxDistance = distance * 2;
      controls.update();
    }
  }, [camera, controls, metrics, width, height, locked]);

  return null;
}

/* ---------------------------------------------------------------- loader ---- */

function ViewerLoader() {
  const active = useProgress((s) => s.active);
  const progress = useProgress((s) => s.progress);

  return (
    <div
      aria-hidden={!active}
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-px w-28 overflow-hidden bg-cream/20">
          <span
            className="block h-px bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="label-type text-cream/50">Loading elevator</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ view ---- */

type Props = {
  /** Drives the GLB's materials and the scene lights in real time. */
  config: ElevatorConfiguration;
  alt?: string;
  modelUrl?: string;
  glassTransparency?: boolean;
  /** Overlay hint text. Pass null to hide it. */
  hint?: string | null;
  className?: string;
  /**
   * Extra classes for the canvas element only. Lets a caller inset the drawable
   * area so an overlay panel does not sit on top of the product — the studio
   * background still fills the whole frame.
   */
  canvasClassName?: string;
  children?: ReactNode;
};

export default function Elevator3DViewer({
  config,
  alt = 'Interactive 3D model of a pneumatic vacuum home elevator',
  modelUrl = ELEVATOR_MODEL_URL,
  glassTransparency = true,
  hint = 'Drag to explore',
  className = '',
  canvasClassName = '',
  children,
}: Props) {
  const [controls, setControls] = useState<ControlsRef | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [spinning, setSpinning] = useState(() => !prefersReducedMotion());
  const [touched, setTouched] = useState(false);

  // Stable so ElevatorModel's effect does not re-run every render.
  const handleMeasured = useCallback((next: ModelMetrics) => setMetrics(next), []);

  // Auto-rotation yields to the visitor, then quietly resumes.
  useEffect(() => {
    if (!controls || prefersReducedMotion()) return;
    let timer: number | undefined;

    const onStart = () => {
      window.clearTimeout(timer);
      setSpinning(false);
      setTouched(true);
    };
    const onEnd = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSpinning(true), 2400);
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    return () => {
      window.clearTimeout(timer);
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
    };
  }, [controls]);

  return (
    <div className={`relative isolate h-full w-full ${className}`}>
      {/* Studio sweep, in CSS rather than a 3D backdrop, so nothing competes
          with the product. Dark because the GLB's frame material is pure white —
          on a light ground the elevator disappeared into the background. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_12%,#1E2A3B_0%,#141922_52%,#0A0D12_100%)]"
      />

        <Canvas
          camera={{ fov: 35, near: 0.1, far: 200, position: [3, 3, 6] }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className={`!absolute inset-0 ${canvasClassName}`}
          aria-label={alt}
          role="img"
        >
          <Suspense fallback={null}>
            <ElevatorModel
              url={modelUrl}
              config={config}
              glassTransparency={glassTransparency}
              onMeasured={handleMeasured}
            />
            <ElevatorLighting
              preset={config.lighting}
              groundY={0}
              footprint={metrics?.footprint ?? 1.2}
              height={metrics?.height ?? 5.5}
            />
            {metrics && <FitCamera metrics={metrics} controls={controls} locked={touched} />}
          </Suspense>

          <OrbitControls
            ref={setControls}
            makeDefault
            enablePan={false}
            enableZoom
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.75}
            zoomSpeed={0.7}
            autoRotate={spinning}
            autoRotateSpeed={0.8}
            minPolarAngle={MathUtils.DEG2RAD * 22}
            maxPolarAngle={MathUtils.DEG2RAD * 92}
          />
        </Canvas>

      <ViewerLoader />

      {/* Bottom-left, so it clears any panel a caller overlays on the right. */}
      {hint && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-5 left-5 z-10 transition-opacity duration-700 ${
            touched ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="label-type flex items-center gap-2.5 border border-cream/15 bg-charcoal/70 px-4 py-2.5 text-cream/70 backdrop-blur-sm">
            <RotateCw size={13} strokeWidth={1.8} className="text-gold" />
            {hint}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
