import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollTrigger,
  prefersReducedMotion,
  useGsap,
  useMediaQuery,
} from '../../hooks/useScrollAnimation';

/**
 * The cinematic bridge between the hero and "One page. Three systems."
 *
 * A tall scroll track with a pinned canvas inside it. The track's own progress
 * — nothing intercepted, nothing hijacked — is the clip's playhead, so the
 * visitor scrolls the page normally and the camera happens to move. Reaching the
 * bottom of the track simply carries on into the next section.
 *
 * three.js lives entirely in the lazily-imported canvas. This file, and so the
 * home page's first paint, never touches it.
 */
const RotundaCanvas = lazy(() => import('./RotundaCanvas'));

/** Scroll runway. 260vh leaves 160vh of travel once the canvas is pinned. */
const TRACK_HEIGHT = 'h-[260vh]';

/**
 * Five beats of the shot, keyed to where each one starts. The camera path was
 * cut to these moments in Blender — the copy names what the frame is already
 * showing rather than narrating over it.
 */
const CHAPTERS = [
  { at: 0, text: 'Built around the home.' },
  { at: 0.2, text: 'Designed to disappear into the architecture.' },
  { at: 0.45, text: 'Precision engineering. Quiet movement.' },
  { at: 0.7, text: 'Made for the way you live.' },
  { at: 0.9, text: 'Elevate the way you live.' },
];

const chapterAt = (progress: number) => {
  let index = 0;
  for (let i = 0; i < CHAPTERS.length; i += 1) if (progress >= CHAPTERS[i].at) index = i;
  return index;
};

export default function RotundaScene() {
  const [reduced] = useState(prefersReducedMotion);
  const mobile = useMediaQuery('(max-width: 900px), (pointer: coarse)');

  /** Written every scroll frame, read inside useFrame. Deliberately not state —
      re-rendering React on every scroll pixel would cost more than the render. */
  const progress = useRef(0);

  // Mount the 3D chunk a viewport early so the download overlaps the hero, and
  // let the ticker run only while the section is actually on screen.
  const [mounted, setMounted] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  /**
   * Everything the scroll touches is written straight to the DOM.
   *
   * Nothing here is state on purpose. A single setState mid-scroll re-renders
   * this component, React reconciles <Canvas>, and R3F re-applies its camera and
   * dpr props over the animated GLB camera — which showed up as a jolt at the
   * first caption change and nowhere earlier, because that was the first
   * re-render of the sequence. Refs plus direct writes keep the whole scroll
   * free of React entirely.
   */
  const playhead = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const captions = useRef<(HTMLParagraphElement | null)[]>([]);
  const lastChapter = useRef(0);

  const showChapter = useCallback((index: number) => {
    if (counter.current) counter.current.textContent = String(index + 1).padStart(2, '0');
    captions.current.forEach((el, i) => {
      if (!el) return;
      const on = i === index;
      el.style.opacity = on ? '1' : '0';
      el.style.transform = on ? 'translateY(0)' : 'translateY(0.5rem)';
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  }, []);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFailed = useCallback(() => setFailed(true), []);

  const scope = useGsap<HTMLElement>(
    (el) => {
      if (reduced) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progress.current = self.progress;
          if (playhead.current) playhead.current.style.transform = `scaleX(${self.progress})`;

          const next = chapterAt(self.progress);
          if (next !== lastChapter.current) {
            lastChapter.current = next;
            showChapter(next);
          }
        },
      });
    },
    [reduced, showChapter],
  );

  /**
   * Two thresholds, because "start downloading" and "start rendering" are not
   * the same moment. The GLB begins arriving a viewport early, while the visitor
   * is still on the hero; the render ticker only starts when the section is
   * genuinely on screen, so scrolling past the rest of the page costs nothing.
   */
  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    const preload = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setMounted(true),
      { rootMargin: '100% 0px 100% 0px' },
    );
    const visible = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));

    preload.observe(el);
    visible.observe(el);
    return () => {
      preload.disconnect();
      visible.disconnect();
    };
  }, [scope]);

  return (
    <section
      ref={scope}
      aria-label="The elevator inside a rotunda — a scroll-driven architectural sequence"
      className={`relative bg-navy-deep ${TRACK_HEIGHT}`}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {mounted && !failed && (
          <Suspense fallback={null}>
            <RotundaCanvas
              progress={progress}
              active={onScreen}
              reduced={reduced}
              mobile={mobile}
              onReady={handleReady}
              onFailed={handleFailed}
            />
          </Suspense>
        )}

        {/* Poster for the wait, and the whole section if WebGL or the model never
            arrives. It is the shot's own opening frame either way, so the
            handover to the live canvas is a focus pull rather than a cut. */}
        <img
          src="/images/hero/rotunda-still.png"
          alt={
            failed
              ? 'A cylindrical glass elevator standing in the rotunda of a home, between two curved staircases'
              : ''
          }
          aria-hidden={failed ? undefined : true}
          className={`absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] transition-opacity duration-1000 ease-brand ${
            ready && !failed ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Grade, then scrims.

            The grade is one warm pool at the top and the brand's navy pooling at
            the floor — the same gold-above / navy-below the hemisphere light
            gives the geometry, continued across the whole frame so the section
            reads as lit rather than tinted. `screen` only ever adds light, so it
            warms the plaster without touching the blacks. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 mix-blend-screen bg-[radial-gradient(70%_45%_at_50%_-5%,rgba(201,164,92,0.20)_0%,rgba(201,164,92,0)_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy/12 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-navy-deep/75 via-transparent to-transparent lg:block"
        />

        {/* Captions. All five are in the DOM and crossfade on progress — no
            mount/unmount, so nothing reflows mid-scroll. Reduced motion pins the
            first line, matching the parked camera. */}
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[88rem] px-6 pb-14 md:px-10 md:pb-16 lg:px-16 lg:pb-20">
            <div className="max-w-xl">
              <p className="label-type flex items-center gap-3 text-gold">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-gold" />
                <span ref={counter}>01</span> / {String(CHAPTERS.length).padStart(2, '0')}
              </p>

              <div className="relative mt-5 min-h-[5.5rem] md:min-h-[6.5rem]">
                {CHAPTERS.map((c, i) => (
                  <p
                    key={c.text}
                    ref={(el) => {
                      captions.current[i] = el;
                    }}
                    aria-hidden={i === 0 ? 'false' : 'true'}
                    // Opacity and transform are owned by showChapter from here
                    // on; these are only the first frame's values.
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: i === 0 ? 'translateY(0)' : 'translateY(0.5rem)',
                    }}
                    className="display-type absolute inset-x-0 top-0 text-title text-cream transition-[opacity,transform] duration-700 ease-brand"
                  >
                    {c.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Playhead. The one piece of chrome, and it reports something true:
            how far through the shot the scroll has taken you. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-cream/12">
          <span
            ref={playhead}
            className="block h-px origin-left bg-gold"
            style={{ transform: `scaleX(${reduced ? 1 : 0})` }}
          />
        </div>
      </div>
    </section>
  );
}
