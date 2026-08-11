export type ProjectCategory = 'villas' | 'duplex' | 'interiors' | 'exterior' | 'showrooms';

export type Project = {
  id: string;
  title: string;
  /** Where in the building the lift sits. */
  context: string;
  elevatorType: string;
  /** Frame finish visible in the photograph. */
  finish: string;
  category: ProjectCategory;
  image: string;
  imageAlt: string;
};

export const projectFilters: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'villas', label: 'Villas' },
  { id: 'duplex', label: 'Duplex' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'showrooms', label: 'Showrooms' },
];

/**
 * Photographs of installed pneumatic vacuum home lifts. Titles describe where
 * the lift sits rather than naming clients — add client names, cities and dates
 * only where the household has agreed to be credited.
 */
export const projects: Project[] = [
  {
    id: 'gallery-12',
    title: 'Living room, wood ceiling',
    context: 'Beside the seating, under a cove-lit wood ceiling',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Grey frame',
    category: 'interiors',
    image: '/images/products/home-lift-gallery-12.webp',
    imageAlt:
      'Grey-framed pneumatic vacuum home lift standing in a modern living room with cream sofas and a wood-panelled cove-lit ceiling',
  },
  {
    id: 'gallery-3',
    title: 'Villa entrance hall',
    context: 'Inside the entrance, beside the carved main door',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'White frame',
    category: 'villas',
    image: '/images/products/home-lift-gallery-3.webp',
    imageAlt:
      'White-framed panoramic home lift in a villa entrance hall with marble flooring and a carved teak door',
  },
  {
    id: 'gallery-4',
    title: 'Duplex stair void',
    context: 'In the open void beside the staircase',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Black frame',
    category: 'duplex',
    image: '/images/products/home-lift-gallery-4.webp',
    imageAlt:
      'Black-framed panoramic home lift rising through the stair void of a duplex, next to a timber balustrade',
  },
  {
    id: 'gallery-2',
    title: 'Terrace level access',
    context: 'On an open balcony serving the upper level',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Silver frame',
    category: 'exterior',
    image: '/images/products/home-lift-gallery-2.webp',
    imageAlt:
      'Silver-framed panoramic home lift installed on an open balcony with trees visible beyond the parapet',
  },
  {
    id: 'gallery-5',
    title: 'Bronze frame hallway',
    context: 'Between the hallway and the stair landing',
    elevatorType: 'Cylindrical home lift',
    finish: 'Bronze frame',
    category: 'interiors',
    image: '/images/products/home-lift-gallery-5.webp',
    imageAlt:
      'Bronze-framed cylindrical home lift in a residential hallway with teak doors and a window beside it',
  },
  {
    id: 'gallery-7',
    title: 'Villa landing',
    context: 'On the landing, in front of the stair run',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Steel grey frame',
    category: 'villas',
    image: '/images/products/home-lift-gallery-7.webp',
    imageAlt:
      'Steel-grey panoramic home lift on a marble villa landing with the staircase visible behind it',
  },
  {
    id: 'gallery-9',
    title: 'Dining room corner',
    context: 'In the dining room, against the feature wall',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Black frame',
    category: 'interiors',
    image: '/images/products/home-lift-gallery-9.webp',
    imageAlt:
      'Black-framed home lift in a dining room beside a geometric gold feature wall and a wood ceiling',
  },
  {
    id: 'gallery-10',
    title: 'Staircase footprint',
    context: 'Within the existing stair footprint',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Copper frame',
    category: 'duplex',
    image: '/images/products/home-lift-gallery-10.webp',
    imageAlt:
      'Copper-framed panoramic home lift fitted within an existing staircase footprint on a granite floor',
  },
  {
    id: 'gallery-1',
    title: 'Ground floor install',
    context: 'Freestanding against a plain wall',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'White frame',
    category: 'interiors',
    image: '/images/products/home-lift-gallery-1.webp',
    imageAlt:
      'White-framed pneumatic vacuum home lift standing against a white panelled wall on a light wood floor',
  },
  {
    id: 'gallery-11',
    title: 'Existing home retrofit',
    context: 'Retrofitted into a completed home',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Dark wood frame',
    category: 'interiors',
    image: '/images/products/home-lift-gallery-11.webp',
    imageAlt:
      'Dark wood-framed panoramic home lift retrofitted into the hall of an existing home with textured yellow walls',
  },
  {
    id: 'gallery-6',
    title: 'Jewellery showroom',
    context: 'Between display floors in a retail showroom',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Black frame',
    category: 'showrooms',
    image: '/images/products/home-lift-gallery-6.webp',
    imageAlt:
      'Black-framed panoramic vacuum lift installed between display floors of a jewellery showroom',
  },
  {
    id: 'gallery-8',
    title: 'Optical showroom',
    context: 'Beside the stair in a two-level shop',
    elevatorType: 'Pneumatic vacuum lift',
    finish: 'Red frame',
    category: 'showrooms',
    image: '/images/products/home-lift-gallery-8.webp',
    imageAlt:
      'Red-framed panoramic vacuum lift beside the staircase of a two-level optical showroom with eyewear displays',
  },
];
