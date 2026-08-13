import type { CSSProperties } from 'react';

/**
 * The room the elevator stands in.
 *
 * Four flat CSS layers, no 3D backdrop, so nothing competes with the product for
 * fill rate or attention:
 *
 *   1. paper    — cool architectural white, deepening toward the floor
 *   2. grid     — 32mm minor / 160mm major survey rule, faded off at the edges
 *   3. key wash — a white pool at the top, the way a softbox lands on a wall
 *   4. frame    — corner vignette plus a floor band, so the product is grounded
 *
 * A light ground was the ask, and it costs contrast on the pale finishes (White,
 * Silver, Beige). The grid is what buys it back: rules pass behind the frame and
 * pick out its edges where a flat wall would have swallowed them. That is also
 * why the wash sits at the top rather than dead centre — the mass of the cab
 * stays over the deeper part of the gradient.
 */

/** Layers 1 and 2 are the only ones that need sizes and a mask. */
const GRID: CSSProperties = {
  backgroundImage: [
    'linear-gradient(to right, rgba(17,24,39,0.07) 1px, transparent 1px)',
    'linear-gradient(to bottom, rgba(17,24,39,0.07) 1px, transparent 1px)',
    'linear-gradient(to right, rgba(8,43,92,0.13) 1px, transparent 1px)',
    'linear-gradient(to bottom, rgba(8,43,92,0.13) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '32px 32px, 32px 32px, 160px 160px, 160px 160px',
  // Anchored to the centre so the rule stays symmetrical at any viewer width.
  backgroundPosition: 'center',
  // Fades the rule out before it reaches the frame edge — the grid should read
  // as a surface the product sits on, not as a border.
  maskImage: 'radial-gradient(108% 86% at 50% 42%, #000 34%, transparent 88%)',
  WebkitMaskImage: 'radial-gradient(108% 86% at 50% 42%, #000 34%, transparent 88%)',
};

const FRAME: CSSProperties = {
  backgroundImage: [
    'radial-gradient(118% 92% at 50% 44%, transparent 54%, rgba(17,24,39,0.10) 100%)',
    'linear-gradient(to top, rgba(8,43,92,0.10) 0%, transparent 32%)',
  ].join(', '),
};

export default function ViewerBackdrop({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#FAFBFC_0%,#F0F2F5_54%,#E3E7EC_100%)]" />
      <div className="absolute inset-0" style={GRID} />
      <div className="absolute inset-0 bg-[radial-gradient(62%_50%_at_50%_4%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="absolute inset-0" style={FRAME} />
    </div>
  );
}
