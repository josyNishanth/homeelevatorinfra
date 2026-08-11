/** Brand, navigation and section copy that isn't product data. */

export const brand = {
  name: 'HomeElevatorInfra',
  wordmark: { first: 'HOME ELEVATOR', second: 'INFRA' },
  tagline: 'Premium home elevators & lifts',
  // TODO: replace placeholders with the real published contact details.
  phone: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  whatsappHref: 'https://wa.me/910000000000',
  email: 'hello@homeelevatorinfra.com',
  serviceArea: 'India',
};

/** Every nav entry is a real route. Order drives the header and the footer. */
export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Elevators', to: '/elevators' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Customize', to: '/customize' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/** Per-route <title> and meta description. */
export const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Home Elevator Infra | Premium Home Elevators & Lifts',
    description:
      'Explore premium home elevators, vacuum lifts, hydraulic lifts and cylindrical home lift solutions with personalised designs and professional installation.',
  },
  '/elevators': {
    title: 'Home Elevators, Vacuum & Hydraulic Lifts | Home Elevator Infra',
    description:
      'Compare vacuum, hydraulic and cylindrical home lifts — capacity, speed, power and site requirements for each system.',
  },
  '/solutions': {
    title: 'Structure Design, Fabrication & Commissioning | Home Elevator Infra',
    description:
      'Elevator structure designing, fabrication and installation, commissioning and solar water heating for residential projects.',
  },
  '/customize': {
    title: 'Personalise Your Lift | Home Elevator Infra',
    description:
      'Choose the exterior finish, cabin interior and lighting for your home elevator, and send the configuration with your quote request.',
  },
  '/projects': {
    title: 'Installations & Clients | Home Elevator Infra',
    description:
      'Home lifts installed across Telangana and Andhra Pradesh — villas, duplexes, interiors, balconies and showrooms.',
  },
  '/about': {
    title: 'About Home Elevator Infra | Residential Lift Specialists',
    description:
      'Why homeowners, architects and builders choose Home Elevator Infra for residential elevators — space, design, finishes and installation.',
  },
  '/contact': {
    title: 'Get a Quote or Book a Site Visit | Home Elevator Infra',
    description:
      'Request a written quotation for a home elevator, or book a site visit with the Home Elevator Infra team.',
  },
};

/** Stops on the shaft rail — the fixed scroll indicator on large screens. */
export const railStops = [
  { id: 'stop-1', label: 'Top' },
  { id: 'stop-2', label: 'Second' },
  { id: 'stop-3', label: 'Third' },
  { id: 'stop-4', label: 'Fourth' },
  { id: 'stop-5', label: 'Fifth' },
  { id: 'stop-6', label: 'Foot' },
];

export const trustPoints = [
  { id: 'space', label: 'Space-smart', note: 'No pit, no headroom, no machine room' },
  { id: 'design', label: 'Premium design', note: '360° panoramic cabin, RAL frame colours' },
  { id: 'finishes', label: 'Custom finishes', note: 'Exterior, interior and lighting' },
  { id: 'install', label: 'Expert installation', note: 'Fabrication through commissioning' },
  { id: 'residential', label: 'Residential solutions', note: 'Villas, duplexes and finished homes' },
];

export const processSteps = [
  {
    index: '01',
    title: 'Tell us about your home',
    body: 'Share the number of floors, where the lift should sit and whether the home is new or existing.',
  },
  {
    index: '02',
    title: 'Site assessment',
    body: 'Our team visits, measures the available space and confirms what the property can accommodate.',
  },
  {
    index: '03',
    title: 'Choose your elevator',
    body: 'Compare vacuum, hydraulic and cylindrical lifts against the space and the way you use it.',
  },
  {
    index: '04',
    title: 'Customise your design',
    body: 'Select the exterior finish, cabin interior and lighting so the lift belongs to the room.',
  },
  {
    index: '05',
    title: 'Installation',
    body: 'Structure fabrication, erection and cabin installation, coordinated around your site.',
  },
  {
    index: '06',
    title: 'Commissioning',
    body: 'Functional testing, handover and operating guidance for everyone in the household.',
  },
];

export const whyPoints = [
  {
    id: 'space-efficient',
    eyebrow: 'Space efficient',
    title: 'Fits the space you can spare, not the space you wish you had.',
    body: 'Compact footprints and space-conscious layouts mean a lift can sit in a stairwell void, a corner or an unused alcove.',
    image: '/images/why/space-efficient.svg',
    imageAlt: 'Slim home elevator shaft fitted against an interior wall',
  },
  {
    id: 'designed-for-home',
    eyebrow: 'Designed for your home',
    title: 'Detailed like furniture, engineered like infrastructure.',
    body: 'Openings, finishes and proportions are planned with your architect so the lift reads as part of the house.',
    image: '/images/why/designed-for-home.svg',
    imageAlt: 'Home elevator integrated beside a tall living room window',
  },
  {
    id: 'personalised-finishes',
    eyebrow: 'Personalised finishes',
    title: 'Standard, textured or metallic — your call.',
    body: 'Choose the exterior finish, cabin interior and lighting temperature, and see the combination before you commit.',
    image: '/images/why/personalised-finishes.svg',
    imageAlt: 'Grid of exterior finish and interior material samples',
  },
  {
    id: 'professional-installation',
    eyebrow: 'Professional installation',
    title: 'One team from structure to handover.',
    body: 'Structure design, fabrication, installation and commissioning are handled in-house, so accountability never moves.',
    image: '/images/why/professional-installation.svg',
    imageAlt: 'Elevator structure being installed by the fabrication team',
  },
  {
    id: 'modern-engineering',
    eyebrow: 'Modern engineering',
    title: 'Quiet, considered mechanics.',
    body: 'Air-driven, hydraulic and cylindrical systems, each selected for the home it goes into rather than the other way round.',
    image: '/images/why/modern-engineering.svg',
    imageAlt: 'Engineering framing detail of a residential elevator structure',
  },
];

/** Real installations, one per kind of space a lift usually goes into. */
export const architectureScenes = [
  {
    id: 'villa',
    label: 'Villa',
    caption: 'Inside the entrance hall',
    image: '/images/products/home-lift-gallery-3.webp',
    imageAlt:
      'White-framed panoramic home lift in a villa entrance hall with marble flooring and a carved teak door',
  },
  {
    id: 'duplex',
    label: 'Duplex',
    caption: 'Through the stair void',
    image: '/images/products/home-lift-gallery-4.webp',
    imageAlt: 'Black-framed panoramic home lift rising through the stair void of a duplex',
  },
  {
    id: 'balcony',
    label: 'Balcony',
    caption: 'Out to the open level',
    image: '/images/products/home-lift-gallery-2.webp',
    imageAlt: 'Silver-framed panoramic home lift installed on an open balcony with trees beyond the parapet',
  },
  {
    id: 'living-room',
    label: 'Living room',
    caption: 'Beside the seating',
    image: '/images/products/home-lift-gallery-12.webp',
    imageAlt:
      'Grey-framed home lift in a modern living room with cream sofas and a cove-lit wood-panelled ceiling',
  },
  {
    id: 'staircase',
    label: 'Staircase',
    caption: 'In the stair footprint',
    image: '/images/products/home-lift-gallery-10.webp',
    imageAlt: 'Copper-framed panoramic home lift fitted within an existing staircase footprint',
  },
  {
    id: 'showroom',
    label: 'Showroom',
    caption: 'Between retail floors',
    image: '/images/products/home-lift-gallery-6.webp',
    imageAlt: 'Black-framed panoramic vacuum lift installed between display floors of a jewellery showroom',
  },
];

/**
 * PLACEHOLDER TESTIMONIALS — not real customers, not real quotes.
 * Replace every field with verified feedback before this site goes live.
 * Keeping `verified: false` makes the placeholder state visible in the UI.
 */
export const testimonials = [
  {
    id: 'placeholder-1',
    quote: 'Placeholder testimonial. Replace this text with a verified quote from a real HomeElevatorInfra customer.',
    author: 'Customer name',
    role: 'Home owner · City',
    project: 'Elevator type',
    verified: false,
  },
  {
    id: 'placeholder-2',
    quote: 'Placeholder testimonial. Replace this text with a verified quote from a real HomeElevatorInfra customer.',
    author: 'Customer name',
    role: 'Villa owner · City',
    project: 'Elevator type',
    verified: false,
  },
  {
    id: 'placeholder-3',
    quote: 'Placeholder testimonial. Replace this text with a verified quote from a real HomeElevatorInfra customer.',
    author: 'Customer name',
    role: 'Architect · City',
    project: 'Elevator type',
    verified: false,
  },
];
