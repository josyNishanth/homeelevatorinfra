import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { elevators } from '../data/elevators';
import { useElevatorConfig } from '../hooks/useElevatorConfig';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import ElevatorViewer from './elevator/ElevatorViewer';
import Button from './ui/Button';
import MaskedHeading from './ui/MaskedHeading';
import { Container } from './ui/Section';

export default function Hero() {
  const { config } = useElevatorConfig();

  const scope = useGsap<HTMLElement>((el) => {
    const q = gsap.utils.selector(el);
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(q('[data-hero-bg]'), { autoAlpha: 0, duration: 1.4 })
      .from(q('[data-hero-visual]'), { autoAlpha: 0, scale: 1.05, duration: 1.6 }, 0.1)
      .from(q('[data-hero-eyebrow]'), { autoAlpha: 0, y: 14, duration: 0.8 }, 0.25)
      .from(q('[data-hero-copy]'), { autoAlpha: 0, y: 22, duration: 0.9 }, 0.75)
      .from(q('[data-hero-cta]'), { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.09 }, 0.9)
      .from(q('[data-hero-foot]'), { autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 1.05);

    gsap.to(q('[data-scroll-dot]'), {
      y: 22,
      repeat: -1,
      duration: 1.5,
      ease: 'power1.inOut',
      yoyo: true,
    });

    // Slow drift on the product as the hero leaves — reads as continued travel.
    gsap.to(q('[data-hero-visual]'), {
      yPercent: -7,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  return (
    <section
      id="home"
      ref={scope}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-deep pt-24 pb-8 text-cream md:pt-28"
    >
      {/* Environment */}
      <div data-hero-bg aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src="/images/hero/backdrop.svg"
          alt=""
          className="h-full w-full object-cover opacity-30"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy-deep/85 to-charcoal/95" />
        <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_18%_78%,rgba(185,149,90,0.16),transparent_70%)]" />
      </div>

      <Container className="flex flex-1 flex-col">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p data-hero-eyebrow className="label-type flex items-center gap-3 text-cream/55">
              <span aria-hidden="true" className="inline-block h-px w-10 bg-gold" />
              Residential elevators &amp; lifts
            </p>

            <h1 className="mt-6 md:mt-8">
              <MaskedHeading
                as="span"
                text={'Elevate the\nWay You Live.'}
                className="block text-hero text-cream"
                onLoad
                delay={0.3}
              />
            </h1>

            <p data-hero-copy className="mt-6 max-w-xl text-lead text-cream/70 md:mt-7">
              Premium home elevators designed for modern homes, villas and spaces where comfort meets
              architecture.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span data-hero-cta className="inline-block">
                <Button to="/elevators" variant="gold" icon={<ArrowDown size={15} strokeWidth={1.6} />}>
                  Explore elevators
                </Button>
              </span>
              <span data-hero-cta className="inline-block">
                <Button to="/quote" variant="onDark" icon={<ArrowUpRight size={15} strokeWidth={1.6} />}>
                  Get a quote
                </Button>
              </span>
            </div>
          </div>

          {/* Product. Swap ElevatorViewer's internals for a 3D canvas later —
              this column's layout does not change. */}
          <div className="lg:col-span-5 lg:col-start-8">
            {/* The left edge dissolves into the hero background rather than
                stopping at a hard border, so the photo reads as part of the
                environment instead of a pasted-in card. */}
            <div
              data-hero-visual
              className="relative mx-auto max-w-md lg:mr-0 lg:ml-auto lg:max-w-[30rem] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_26%)] [mask-image:linear-gradient(to_right,transparent,#000_26%)]"
            >
              <ElevatorViewer
                config={config}
                mode="image"
                image="/images/products/home-lift-gallery-12.webp"
                alt="Pneumatic vacuum home elevator installed in a modern living room with a cove-lit wood ceiling"
                priority
                className="aspect-[4/5] w-full bg-navy-deep"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-24 bg-gradient-to-t from-navy-deep to-transparent"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-cream/12 pt-6">
          <div data-hero-foot className="flex items-center gap-4">
            <span className="relative flex h-10 w-4 items-start justify-center overflow-hidden">
              <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-cream/20" />
              <span data-scroll-dot aria-hidden="true" className="mt-0 h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="label-type text-cream/45">Scroll</span>
          </div>

          <dl data-hero-foot className="flex flex-wrap gap-x-10 gap-y-3">
            {elevators.map((e) => (
              <div key={e.id} className="flex items-baseline gap-3">
                <dt className="label-type text-gold/70">{e.index}</dt>
                <dd className="label-type text-cream/60">{e.shortName}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
