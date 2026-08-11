import { ArrowRight } from 'lucide-react';
import { findInterior, findLighting } from '../../data/colors';
import { CONFIG_DISCLAIMER, findTier, formatRupees } from '../../data/pricing';
import { finishLabel, useElevatorConfig } from '../../hooks/useElevatorConfig';
import { useCountUp } from '../../hooks/useScrollAnimation';
import { findElevator } from '../../data/elevators';
import Button from '../ui/Button';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-cream/12 py-3">
      <dt className="label-type text-cream/45">{label}</dt>
      <dd className="text-right text-sm text-cream">{value}</dd>
    </div>
  );
}

/**
 * Live summary of the configuration. Shows the official starting price for the
 * selected number of floors and nothing else — there is no per-option pricing
 * until HomeElevatorInfra publishes one.
 */
export default function ConfigSummary({ className = '' }: { className?: string }) {
  const { config, basePrice } = useElevatorConfig();
  const priceRef = useCountUp(basePrice, formatRupees);
  const tier = findTier(config.floors);

  return (
    <aside
      aria-label="Your elevator configuration"
      className={`bg-charcoal p-7 text-cream shadow-[0_30px_60px_-40px_rgba(17,24,39,0.7)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="label-type text-gold">Your elevator</p>
        <span aria-hidden="true" className="mt-1 h-px w-10 bg-gold/60" />
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="display-type text-4xl">{config.floors}</p>
        <p className="font-mono text-lg tracking-tight text-cream" aria-live="polite">
          <span ref={priceRef}>{formatRupees(basePrice)}</span>
        </p>
      </div>
      <p className="mt-2 text-xs text-cream/45">{tier.stops}</p>

      <dl className="mt-7">
        <Row label="Model" value={findElevator(config.model).shortName} />
        <Row label="Finish" value={finishLabel(config)} />
        <Row label="Interior" value={findInterior(config.interior).name} />
        <Row label="Lighting" value={findLighting(config.lighting).name} />
      </dl>

      <div className="mt-7 border-t border-gold/40 pt-5">
        <p className="label-type text-cream/45">Starting price</p>
        <p className="mt-2 display-type text-3xl text-cream">{tier.priceShort}</p>
        <p className="mt-3 text-xs leading-relaxed text-cream/50">{CONFIG_DISCLAIMER}</p>
      </div>

      <Button to="/contact" variant="gold" className="mt-6 w-full" icon={<ArrowRight size={15} strokeWidth={1.6} />}>
        Request quote
      </Button>
    </aside>
  );
}
