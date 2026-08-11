export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  /** What the visitor actually receives — kept to work the company performs. */
  deliverables: string[];
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    id: 'structure-design',
    index: '01',
    title: 'Elevator Structure Designing',
    description:
      'Designing elevator structures with attention to space, safety and architectural integration.',
    deliverables: ['Shaft and opening layout', 'Load and clearance planning', 'Coordination with your architect'],
    image: '/images/services/structure-design.svg',
    imageAlt: 'Structural framing drawing for a residential elevator shaft',
  },
  {
    id: 'fabrication-installation',
    index: '02',
    title: 'Elevator Structure Fabrication & Installation',
    description: 'Complete fabrication and installation solutions for residential elevator structures.',
    deliverables: ['Structure fabrication', 'On-site erection', 'Cabin and door installation'],
    image: '/images/services/fabrication-installation.svg',
    imageAlt: 'Fabricated steel elevator structure being assembled on site',
  },
  {
    id: 'commissioning',
    index: '03',
    title: 'Commissioning',
    description: 'Testing and commissioning after successful elevator installation.',
    deliverables: ['Functional testing', 'Handover walkthrough', 'Operating guidance for the household'],
    image: '/images/services/commissioning.svg',
    imageAlt: 'Installed home elevator cabin being tested before handover',
  },
  {
    id: 'solar-water-heater',
    index: '04',
    title: 'Solar Water Heater',
    description: 'Efficient solar water-heating solutions for residential applications.',
    deliverables: ['Roof assessment', 'System supply and installation', 'Commissioning and handover'],
    image: '/images/services/solar-water-heater.svg',
    imageAlt: 'Roof-mounted solar water heating panel and storage tank',
  },
];
