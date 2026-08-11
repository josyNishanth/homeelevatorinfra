import { whyPoints } from '../data/content';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

function WhyBlock({ index }: { index: number }) {
  const point = whyPoints[index];
  const flipped = index % 2 === 1;

  const scope = useGsap<HTMLDivElement>((el) => {
    if (prefersReducedMotion()) return;
    const img = el.querySelector('[data-parallax]');
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  return (
    <div ref={scope} className="grid items-center gap-8 py-12 md:py-16 lg:grid-cols-12 lg:gap-16">
      <div className={`lg:col-span-6 ${flipped ? 'lg:order-last lg:col-start-7' : ''}`}>
        <Reveal y={30} scale={1.02} duration={1}>
          <figure className="relative overflow-hidden bg-cream-dim">
            <div data-parallax className="aspect-[16/10] w-full">
              <img
                src={point.image}
                alt={point.imageAlt}
                loading="lazy"
                decoding="async"
                className="h-[112%] w-full -translate-y-[5%] object-cover"
              />
            </div>
          </figure>
        </Reveal>
      </div>

      <div className={`lg:col-span-5 ${flipped ? 'lg:order-first lg:col-start-1' : 'lg:col-start-8'}`}>
        <Reveal y={20}>
          <p className="label-type flex items-center gap-3 text-ink/45">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-gold" />
            {point.eyebrow}
          </p>
          <h3 className="display-type mt-6 text-title">{point.title}</h3>
          <p className="mt-5 max-w-md text-ink/60">{point.body}</p>
        </Reveal>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <Section id="about" tone="white" pad="lg">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-ink/50">Why HomeElevatorInfra</Eyebrow>
            </Reveal>
            <MaskedHeading
              as="h2"
              text={'Built around the home,\nnot the machine'}
              className="mt-7 text-display"
            />
          </div>
        </div>

        <div className="mt-10 lg:mt-16">
          {whyPoints.map((point, i) => (
            <WhyBlock key={point.id} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
