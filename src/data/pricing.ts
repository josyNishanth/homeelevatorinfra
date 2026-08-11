import type { FloorsKey } from '../types/elevator';

export type PricingTier = {
  id: FloorsKey;
  /** Official HomeElevatorInfra starting price, in rupees. */
  price: number;
  priceShort: string;
  stops: string;
  suitedTo: string;
  includes: string[];
};

/**
 * Official starting prices supplied by HomeElevatorInfra. Do not substitute
 * competitor pricing, and do not add per-option pricing until the company
 * publishes a rate card.
 */
export const pricingTiers: PricingTier[] = [
  {
    id: 'G+1',
    price: 1_400_000,
    priceShort: '₹14 Lakhs',
    stops: 'Ground + 1 floor',
    suitedTo: 'Two-level homes and compact duplexes',
    includes: ['Two stops', 'Standard cabin finish', 'Structure design review'],
  },
  {
    id: 'G+2',
    price: 1_600_000,
    priceShort: '₹16 Lakhs',
    stops: 'Ground + 2 floors',
    suitedTo: 'Villas and three-level duplexes',
    includes: ['Three stops', 'Choice of finish family', 'Structure design review'],
  },
  {
    id: 'G+3',
    price: 2_000_000,
    priceShort: '₹20 Lakhs',
    stops: 'Ground + 3 floors',
    suitedTo: 'Tall villas and multi-level residences',
    includes: ['Four stops', 'Choice of finish family', 'Structure design review'],
  },
];

export const PRICE_DISCLAIMER =
  'Starting price. Final pricing may vary based on selected configuration and site requirements.';

export const CONFIG_DISCLAIMER =
  'Final quotation depends on selected configuration and site requirements.';

export const findTier = (id: FloorsKey): PricingTier =>
  pricingTiers.find((t) => t.id === id) ?? pricingTiers[0];

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const formatRupees = (value: number) => `₹${inr.format(Math.round(value))}`;
