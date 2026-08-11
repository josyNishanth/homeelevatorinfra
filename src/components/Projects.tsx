import { useMemo, useState } from 'react';
import { projectFilters, projects, type ProjectCategory } from '../data/projects';
import { gsap, prefersReducedMotion, useGsap } from '../hooks/useScrollAnimation';
import MaskedHeading from './ui/MaskedHeading';
import Reveal from './ui/Reveal';
import Section, { Container, Eyebrow } from './ui/Section';

type Filter = ProjectCategory | 'all';

// Photographs are 720×882 — a 4:5 tile crops almost nothing.
const TILE = 'aspect-[4/5]';

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const grid = useGsap<HTMLDivElement>(
    (el) => {
      if (prefersReducedMotion()) return;
      gsap.from(el.querySelectorAll('[data-tile]'), {
        autoAlpha: 0,
        y: 22,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
      });
    },
    [filter],
  );

  return (
    <Section id="projects" tone="cream" pad="lg">
      <Container>
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-ink/50">Projects</Eyebrow>
            </Reveal>
            <MaskedHeading as="h2" text="Lifts in real rooms" className="mt-7 text-display" />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-ink/60">
              Installed lifts, photographed where they stand — entrance halls, stair voids, dining rooms,
              balconies and showrooms. Every one went into a finished building.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-2 gap-y-3 border-t border-ink/12 pt-6">
          {projectFilters.map((option) => {
            const selected = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(option.id)}
                className={`label-type border px-4 py-2.5 transition-colors duration-300 ease-swift ${
                  selected
                    ? 'border-navy bg-navy text-cream'
                    : 'border-ink/15 text-ink/55 hover:border-ink/35 hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div ref={grid} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((project) => (
            <article key={project.id} data-tile className="group relative overflow-hidden bg-cream-dim">
              <div className={`relative ${TILE} w-full overflow-hidden`}>
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={882}
                  className="h-full w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.06]"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-500 ease-brand group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="display-type text-xl text-cream">{project.title}</h3>
                  <p className="label-type mt-2 text-gold/85">{project.elevatorType}</p>
                  <p className="mt-2 text-sm text-cream/65">{project.context}</p>
                  <p className="label-type mt-2 text-cream/40">{project.finish}</p>
                </div>
              </div>

              {/* Always-legible caption for touch and keyboard users. */}
              <div className="flex items-baseline justify-between gap-4 px-1 py-4 group-hover:opacity-100 lg:group-hover:opacity-0">
                <span className="display-type text-base">{project.title}</span>
                <span className="label-type text-ink/45">{project.finish}</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
