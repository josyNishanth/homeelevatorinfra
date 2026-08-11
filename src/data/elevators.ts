import type { ElevatorModel } from '../types/elevator';

export type Spec = { label: string; value: string };

export type Elevator = {
  id: ElevatorModel;
  /** Two-digit index used by the section eyebrows and the shaft rail. */
  index: string;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  /** Short descriptors shown as a mono spec row over the product image. */
  specs: Spec[];
  /** Full specification table shown under the product features. */
  specifications: Spec[];
  /** What the building has to provide. The question every visitor asks first. */
  siteRequirements: string[];
  /**
   * Where the specification comes from. Figures below are the manufacturer's
   * published specification for the systems HomeElevatorInfra installs, not a
   * site-specific promise — the caveat is rendered with the table.
   */
  specNote: string;
};

export const elevators: Elevator[] = [
  {
    id: 'vacuum',
    index: '01',
    name: 'Vacuum Elevators',
    shortName: 'Vacuum',
    headline: 'Air-driven, and barely there.',
    description:
      'Air-driven residential elevators designed for compact spaces with a modern panoramic form. The cabin rises inside a sealed polycarbonate tube on a column of air — no counterweights, no cables, no machine room.',
    features: [
      'Compact footprint',
      'Panoramic design',
      'Modern appearance',
      'Residential applications',
      'Custom finishes',
    ],
    image: '/images/products/home-lift-gallery-12.webp',
    imageAlt:
      'Pneumatic vacuum home elevator with a grey frame installed in a modern living room with a wood-panelled ceiling',
    specs: [
      { label: 'Drive', value: 'Air pressure' },
      { label: 'Form', value: 'Panoramic tube' },
      { label: 'Best for', value: 'Compact homes' },
    ],
    specifications: [
      { label: 'Capacity', value: '205 kg' },
      { label: 'Passengers', value: '2' },
      { label: 'Stops', value: 'Up to 4 (G+3)' },
      { label: 'Speed', value: '0.20 m/s' },
      { label: 'Power', value: '4.5 kW · 230 V single phase' },
      { label: 'External diameter', value: '933 mm' },
      { label: 'Cabin height', value: '2000 mm' },
      { label: 'Head chamber', value: '2550 mm' },
      { label: 'Enclosure', value: 'Clear polycarbonate' },
    ],
    siteRequirements: [
      'No pit',
      'No headroom',
      'No machine room',
      'One 1 m diameter opening per slab',
      'Single-phase supply',
    ],
    specNote:
      'Manufacturer specification for the PVE pneumatic system. Exact figures for your home are confirmed at the site assessment.',
  },
  {
    id: 'hydraulic',
    index: '02',
    name: 'Hydraulic Home Lifts',
    shortName: 'Hydraulic',
    headline: 'Built for homes that carry weight.',
    description:
      'A robust residential lifting solution designed for homes requiring dependable vertical mobility and flexible cabin configurations. A fluid-driven piston does the lifting, so the cabin is supported from below rather than suspended.',
    features: [
      'Strong construction',
      'Smooth operation',
      'Multiple cabin options',
      'Custom interiors',
      'Residential applications',
    ],
    image: '/images/products/13.webp',
    imageAlt: 'Cylindrical glass home lift installed in a double-height atrium beside a staircase',
    specs: [
      { label: 'Drive', value: 'Hydraulic' },
      { label: 'Form', value: 'Shaft cabin' },
      { label: 'Best for', value: 'Villas, duplexes' },
    ],
    specifications: [
      { label: 'Capacity', value: '250 / 300 / 400 kg' },
      { label: 'Passengers', value: '3 to 5' },
      { label: 'Stops', value: 'Up to 4 (G+3)' },
      { label: 'Travel', value: 'Up to 10.5 m' },
      { label: 'Speed', value: '0.2 – 0.3 m/s' },
      { label: 'Pit', value: '120 mm' },
      { label: 'Shaft', value: 'Aluminium, MS or civil' },
      { label: 'Doors', value: 'Panoramic, swing or automatic' },
      { label: 'Cabin', value: 'Two-side glass, or L-shaped glass' },
    ],
    siteRequirements: [
      '120 mm pit',
      'No headroom',
      'No overhead machine room',
      'Remote power pack option',
      'Indoor or outdoor shaft',
    ],
    specNote:
      'Manufacturer specification for the hydraulic systems we install. Capacity, cabin and shaft are selected for your site at the assessment.',
  },
  {
    id: 'cylindrical',
    index: '03',
    name: 'Cylindrical Home Lifts',
    shortName: 'Cylindrical',
    headline: 'A lift that becomes part of your architecture.',
    description:
      'A statement architectural lift that combines panoramic visibility with a distinctive circular form. The round cabin reads as a piece of the building rather than a machine bolted into it.',
    features: [
      'Circular design',
      'Panoramic visibility',
      'Modern appearance',
      'Space-conscious design',
      'Premium interior options',
    ],
    image: '/images/products/home-lift-gallery-5.webp',
    imageAlt:
      'Cylindrical panoramic home lift with a bronze frame installed beside wood-panelled doors in a residential hallway',
    specs: [
      { label: 'Plan', value: 'Circular' },
      { label: 'Form', value: '360° glazing' },
      { label: 'Best for', value: 'Open stairwells' },
    ],
    specifications: [
      { label: 'Passengers', value: '2 to 6' },
      { label: 'Most specified', value: '4 to 6 passengers' },
      { label: 'Stops', value: 'Up to 4 (G+3)' },
      { label: 'Drive', value: 'Pneumatic or hydraulic' },
      { label: 'View', value: '360° panoramic' },
      { label: 'Enclosure', value: 'Curved glass or polycarbonate' },
      { label: 'Frame finish', value: 'RAL colour range' },
      { label: 'Structure', value: 'Self-supporting' },
    ],
    siteRequirements: [
      'No civil shaft for the pneumatic version',
      'No pit or headroom for the pneumatic version',
      'Self-supporting structure',
      'Indoor or balcony placement',
      'Single-phase supply',
    ],
    specNote:
      'Passenger count and drive type depend on the configuration you choose. Both are confirmed at the site assessment.',
  },
];

export const findElevator = (id: ElevatorModel): Elevator =>
  elevators.find((e) => e.id === id) ?? elevators[0];
