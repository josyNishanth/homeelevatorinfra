export type Faq = { id: string; question: string; answer: string };

/**
 * Answers stay within what is verifiable: HomeElevatorInfra's published starting
 * prices, and the manufacturer specification of the systems we install. No
 * installation duration, certification or performance claim is stated until the
 * company supplies one.
 */
export const faqs: Faq[] = [
  {
    id: 'cost',
    question: 'How much does a home elevator cost?',
    answer:
      'HomeElevatorInfra currently offers starting configurations from ₹14 Lakhs for G+1, ₹16 Lakhs for G+2 and ₹20 Lakhs for G+3. Final pricing depends on configuration and site requirements.',
  },
  {
    id: 'shaft',
    question: 'Do I need a large elevator shaft?',
    answer:
      'No shaft is needed for the pneumatic vacuum lift — it is a self-supporting tube roughly 933 mm across, and it needs no pit, no headroom and no machine room. What it does need is a one-metre-diameter opening through each floor slab it passes. Hydraulic lifts need a shallow 120 mm pit and can use an aluminium, MS or civil shaft, still without an overhead machine room. Which of these suits your home is confirmed at the site assessment.',
  },
  {
    id: 'colour',
    question: 'Can I customise the colour?',
    answer:
      'Yes, where the selected product supports it. Frames are available across a RAL colour range — the installations in our gallery include white, black, grey, silver, bronze, copper and dark wood finishes. You can also choose the cabin interior and lighting. Use the personalisation section to build a combination and send it with your quote request.',
  },
  {
    id: 'existing-home',
    question: 'Can the elevator be installed in an existing home?',
    answer:
      'Often, yes — most of the lifts in our gallery went into buildings that were already finished and occupied. The pneumatic system is self-supporting and needs minimal civil work, which is what makes retrofitting practical. Suitability still depends on available space, structure and access at your property, so we confirm it with a site assessment before recommending a product.',
  },
  {
    id: 'power',
    question: 'What power supply does it need?',
    answer:
      'The pneumatic vacuum lift runs on a single-phase 230 V supply, rated at 4.5 kW. It uses air rather than oil, so there is no hydraulic fluid to top up and no lubrication schedule. Hydraulic lifts are specified per configuration; we confirm the electrical requirement with your quotation.',
  },
  {
    id: 'capacity',
    question: 'How many people does it carry?',
    answer:
      'The pneumatic vacuum lift is rated at 205 kg, which suits two passengers, and serves up to four stops (G+3). Hydraulic lifts are available at 250, 300 or 400 kg for three to five passengers. Cylindrical cabins are configured for two to six passengers depending on the drive selected.',
  },
  {
    id: 'timeline',
    question: 'How long does installation take?',
    answer:
      'Installation timelines depend on the selected elevator, site conditions and project requirements. Because the pneumatic system needs little civil work, it is usually far quicker than a conventional shaft build — we share an indicative schedule with your quotation once the configuration and site details are known.',
  },
  {
    id: 'site-visit',
    question: 'Can I request a site visit?',
    answer:
      'Yes. Book a site visit and our team will assess the space, discuss the options that fit your home and follow up with a written quotation.',
  },
];
