import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { ElevatorConfiguration, ViewerMode } from '../../types/elevator';
import { gsap, prefersReducedMotion } from '../../hooks/useScrollAnimation';
import { resolveMaterials } from './ElevatorMaterials';

type Props = {
  config: ElevatorConfiguration;
  /**
   * 'image' renders the pre-rendered visual for the current configuration.
   * '3d' is reserved for the React Three Fiber viewer; until that ships it
   * falls back to the image so callers can opt in early without breaking.
   */
  mode?: ViewerMode;
  /** Overrides the configuration-derived image (used by the hero). */
  image?: string;
  alt?: string;
  className?: string;
  /** Skip lazy-loading for above-the-fold use. */
  priority?: boolean;
  children?: ReactNode;
};

/**
 * Presentation shell for the elevator. Layout, framing and overlays live here;
 * what fills the frame is swappable. Replacing the <img> stack with a
 * <Canvas> from @react-three/fiber requires no changes outside this file.
 */
export default function ElevatorViewer({
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
