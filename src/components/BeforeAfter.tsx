import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { MoveHorizontal } from 'lucide-react';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export default function BeforeAfter() {
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(52);
  const [dragging, setDragging] = useState(false);

  const moveTo = useCallback((clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    setPos(clamp(((clientX - box.left) / box.width) * 100));
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    moveTo(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    moveTo(e.clientX);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    const map: Record<string, number> = {
      ArrowLeft: -step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowUp: step,
    };
    if (e.key in map) {
      e.preventDefault();
      setPos((p) => clamp(p + map[e.key]));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPos(100);
    }
  };

  return (
    <Section tone="cream" pad="lg">
      <Container>
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-ink/50">Before / after</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text="Drag to change the way you move" className="mt-7 text-display" />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-ink/60">
              The same landing, two ways to reach it. Drag the divider, or use the arrow keys.
            </p>
          </Reveal>
        </div>

        <Reveal y={26} className="mt-12 lg:mt-16">
          <div
            ref={frame}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            className={`relative aspect-[4/3] w-full touch-pan-y overflow-hidden bg-cream-dim select-none md:aspect-[16/9] ${
              dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <img
              src="/images/compare/before.svg"
              alt="Staircase access between floors before a home elevator is installed"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              aria-hidden={pos < 4}
            >
              <img
                src="/images/compare/after.svg"
                alt="The same landing served by a modern home elevator"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <span className="label-type pointer-events-none absolute bottom-5 left-5 bg-charcoal/80 px-3 py-2 text-cream">
              After · Modern home elevator
            </span>
            <span className="label-type pointer-events-none absolute right-5 bottom-5 bg-cream/85 px-3 py-2 text-ink">
              Before · Traditional access
            </span>

            <div
              role="slider"
              tabIndex={0}
              aria-label="Compare traditional access with a modern home elevator"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% modern home elevator`}
              onKeyDown={onKeyDown}
              className="absolute inset-y-0 z-10 -ml-6 w-12 cursor-ew-resize"
              style={{ left: `${pos}%` }}
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-cream/90" />
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-navy shadow-[0_14px_30px_-14px_rgba(17,24,39,0.7)] transition-transform duration-300 ease-brand hover:scale-105"
              >
                <MoveHorizontal size={18} strokeWidth={1.6} />
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
