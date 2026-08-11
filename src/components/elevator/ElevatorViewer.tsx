import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { ElevatorConfiguration, ViewerMode } from '../../types/elevator';
import { gsap, prefersReducedMotion } from '../../hooks/useScrollAnimation';
import { resolveMaterials } from './ElevatorMaterials';
import ViewerErrorBoundary from './ViewerErrorBoundary';

/**
 * three.js, @react-three/fiber and @react-three/drei are a large dependency, and
 * only the /customize route needs them. Loading the 3D viewer lazily keeps that
 * weight out of the bundle every other page downloads.
 */
const Elevator3DViewer = lazy(() => import('./Elevator3DViewer'));

type Props = {
  config: ElevatorConfiguration;
  /**
   * 'image' renders the pre-rendered visual for the current configuration.
   * '3d' renders the interactive React Three Fiber viewer, falling back to the
   * image viewer if WebGL or the model is unavailable.
   */
  mode?: ViewerMode;
  /** Overrides the configuration-derived image (used by the hero). */
  image?: string;
  alt?: string;
  className?: string;
  /** Skip lazy-loading for above-the-fold use. */
  priority?: boolean;
  children?: ReactNode;
  /** 3D only: hide or replace the "Drag to explore" hint. */
  hint?: string | null;
  /** 3D only: render the GLB's glazing exactly as exported (opaque). */
  glassTransparency?: boolean;
  /** 3D only: inset the canvas so an overlay panel does not cover the product. */
  canvasClassName?: string;
};

/**
 * Presentation shell for the elevator. Layout, framing and overlays live here;
 * what fills the frame is swappable — an image stack today, a 3D canvas on the
 * routes that opt in with mode="3d".
 */
export default function ElevatorViewer(props: Props) {
  const { config, mode = 'image', className = '', children, alt, hint, glassTransparency, canvasClassName } = props;

  if (mode === '3d') {
    const materials = resolveMaterials(config);
    return (
      // The boundary sits outside the wrapper so the fallback can bring its own
      // sized container; nested inside, it would collapse to zero height.
      <ViewerErrorBoundary fallback={<ElevatorImageStack {...props} mode="image" />}>
        <div
          data-viewer-mode="3d"
          className={`relative isolate overflow-hidden bg-cream-dim ${className}`}
          style={materials.vars as CSSProperties}
        >
          <Suspense fallback={<ViewerSkeleton />}>
            <Elevator3DViewer
              config={config}
              alt={alt}
              hint={hint}
              glassTransparency={glassTransparency}
              canvasClassName={canvasClassName}
            />
          </Suspense>
          {children}
        </div>
      </ViewerErrorBoundary>
    );
  }

  return <ElevatorImageStack {...props} />;
}

/** Shown while the 3D chunk downloads. */
function ViewerSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(115%_85%_at_50%_12%,#1E2A3B_0%,#141922_52%,#0A0D12_100%)]">
      <p className="label-type text-cream/40">Preparing 3D viewer</p>
    </div>
  );
}

/**
 * The original image implementation, unchanged. Hero, ProductShowcase and the
 * finish swatches all render through this path.
 */
function ElevatorImageStack({
  config,
  mode = 'image',
  image,
  alt,
  className = '',
  priority = false,
  children,
}: Props) {
  const materials = resolveMaterials(config);
  const src = image ?? materials.image;
  /**
   * The interior / lighting / sheen washes exist to show configuration changes
   * on the studio renders. A caller-supplied photograph already has its own
   * light, so leave it alone.
   */
  const configured = !image;

  const shell = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const [stack, setStack] = useState([{ id: 0, src }]);

  // Queue the new visual; the effect below crossfades it over the old one.
  useEffect(() => {
    setStack((prev) => (prev[prev.length - 1].src === src ? prev : [...prev, { id: nextId.current++, src }]));
  }, [src]);

  useEffect(() => {
    const el = shell.current;
    if (!el || stack.length < 2) return;

    const layers = el.querySelectorAll<HTMLElement>('[data-layer]');
    const top = layers[layers.length - 1];
    if (!top) return;

    const reduced = prefersReducedMotion();
    const tween = gsap.fromTo(
      top,
      { opacity: 0, scale: reduced ? 1 : 1.035 },
      {
        opacity: 1,
        scale: 1,
        duration: reduced ? 0 : 0.72,
        ease: 'power2.out',
        onComplete: () => setStack((s) => s.slice(-1)),
      },
    );
    return () => {
      tween.kill();
    };
  }, [stack]);

  return (
    <div
      ref={shell}
      data-viewer-mode={mode}
      className={`relative isolate overflow-hidden bg-cream-dim ${className}`}
      style={materials.vars as CSSProperties}
    >
      {stack.map((layer, i) => (
        <img
          key={layer.id}
          data-layer
          src={layer.src}
          alt={i === stack.length - 1 ? (alt ?? 'Configured home elevator') : ''}
          aria-hidden={i === stack.length - 1 ? undefined : true}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}

      {configured && (
        <>
          {/* Interior material wash — reads as the cabin floor and back wall. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] mix-blend-soft-light"
            style={{
              background:
                'linear-gradient(to top, color-mix(in srgb, var(--interior) 55%, transparent), color-mix(in srgb, var(--interior-accent) 18%, transparent) 55%, transparent)',
            }}
          />
          {/* Cabin lighting — colour temperature and strength come from materials. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{
              background:
                'radial-gradient(60% 42% at 50% 12%, color-mix(in srgb, var(--lighting) calc(var(--light-strength) * 100%), transparent), transparent 70%)',
            }}
          />
          {/* Metallic sheen for the selected finish family. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              opacity: 'var(--sheen)',
              background:
                'linear-gradient(115deg, transparent 22%, rgba(255,255,255,0.9) 44%, transparent 62%)',
            }}
          />
        </>
      )}

      {children}
    </div>
  );
}
