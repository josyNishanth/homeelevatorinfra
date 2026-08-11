import { findFinish, findInterior, findLighting } from '../../data/colors';
import { elevators } from '../../data/elevators';
import { pricingTiers } from '../../data/pricing';
import { useElevatorConfig } from '../../hooks/useElevatorConfig';
import type { ElevatorModel, FloorsKey } from '../../types/elevator';
import MaskedHeading from '../ui/MaskedHeading';
import Reveal from '../ui/Reveal';
import Section, { Container, Eyebrow } from '../ui/Section';
import Segmented from '../ui/Segmented';
import ConfigSummary from './ConfigSummary';
import ElevatorControls from './ElevatorControls';
import ElevatorViewer from './ElevatorViewer';

/**
 * "Personalise your lift" — the section the whole page funnels toward.
 *
 * Controls write to shared configuration state; the viewer reads it. Neither
 * knows how the other works, which is what lets the image stack become a
 * Three.js canvas later without touching this layout.
 */
export default function ElevatorConfigurator() {
  const { config, setFloors, setModel } = useElevatorConfig();
  const finish = findFinish(config.exteriorColor);

  return (
    <Section id="customize" tone="white" pad="lg">
      <Container>
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow className="text-ink/50">Personalise</Eyebrow>
            </Reveal>
            <MaskedHeading
              as="h2"
              text={'Personalise your lift\nto reflect your style'}
              className="mt-7 text-display"
            />
          </div>
          <Reveal y={18} delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-lead text-ink/65">
              Choose the finishes, interiors and details that make your elevator feel like part of your home.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* Visual — first on mobile so the product leads. */}
          <div className="order-first lg:order-last lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <div className="relative">
                <ElevatorViewer
                  config={config}
                  mode="3d"
                  alt={`Interactive 3D model of a pneumatic vacuum home elevator. Drag to rotate, scroll to zoom. Currently configured with a ${findFinish(
                    config.exteriorColor,
                  ).name.toLowerCase()} finish, ${findInterior(
                    config.interior,
                  ).name.toLowerCase()} interior and ${findLighting(config.lighting).name.toLowerCase()} lighting.`}
                  className="aspect-[4/5] w-full sm:aspect-[3/4]"
                  // The summary card overlays the right side from lg up, so the
                  // canvas is narrowed to the free area and the elevator is never
                  // drawn behind it. Width must win over the inline width:100%
                  // that React Three Fiber puts on its container, hence "!".
                  canvasClassName="lg:!w-[calc(100%-20rem)]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5">
                    <span className="label-type bg-cream/85 px-3 py-2 text-ink backdrop-blur-sm">
                      {finish.name}
                    </span>
                    <span className="label-type bg-charcoal/80 px-3 py-2 text-cream backdrop-blur-sm">
                      {config.floors}
                    </span>
                  </div>
                </ElevatorViewer>

                <ConfigSummary className="mt-8 lg:absolute lg:right-6 lg:bottom-6 lg:mt-0 lg:w-[19.5rem]" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="label-type mb-3 text-ink/50">Elevator</p>
                  <Segmented
                    name="config-model"
                    legend="Elevator model"
                    value={config.model}
                    onChange={(id) => setModel(id as ElevatorModel)}
                    options={elevators.map((e) => ({ id: e.id, label: e.shortName }))}
                  />
                </div>
                <div>
                  <p className="label-type mb-3 text-ink/50">Height</p>
                  <Segmented
                    name="config-floors"
                    legend="Number of floors"
                    value={config.floors}
                    onChange={(id) => setFloors(id as FloorsKey)}
                    options={pricingTiers.map((t) => ({ id: t.id, label: t.id }))}
                  />
                </div>
              </div>

              <ElevatorControls />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
