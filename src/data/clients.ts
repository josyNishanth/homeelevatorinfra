/**
 * Client and coverage record.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ BEFORE PUBLISHING: every name in `namedClients` is a real, identifiable │
 * │ person or organisation. Publish only the ones who are genuinely         │
 * │ HomeElevatorInfra's own clients AND who have agreed to be named.        │
 * │ Delete the rest — `sectors` and `coverage` carry the section on their   │
 * │ own if the named list is empty.                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export type Sector = {
  id: string;
  label: string;
  note: string;
};

export const sectors: Sector[] = [
  {
    id: 'medical',
    label: 'Medical',
    note: 'Consultants and specialists — cardiology, ENT, radiology, paediatrics',
  },
  {
    id: 'film',
    label: 'Film & literature',
    note: 'Actors and authors, in private residences',
  },
  {
    id: 'judiciary',
    label: 'Judiciary & public office',
    note: 'Serving and retired justices, and elected representatives',
  },
  {
    id: 'institutions',
    label: 'Institutions',
    note: 'Educational societies, guest houses and private individuals',
  },
];

export type NamedClient = {
  name: string;
  role: string;
  sector: Sector['id'];
  /** City, where the record names one. */
  city?: string;
};

export const namedClients: NamedClient[] = [
  { name: 'Mr. K. Chiranjeevi', role: 'Film actor', sector: 'film' },
  { name: 'Dr. M. Mohan Babu', role: 'Film actor', sector: 'film' },
  { name: 'Mr. Ravi Teja', role: 'Film actor', sector: 'film' },
  { name: 'Yanamuri Veerendranath', role: 'Author', sector: 'film' },

  { name: 'Dr. Sanath Reddy', role: 'Apollo Hospitals', sector: 'medical' },
  { name: 'Dr. Kiran Kumar Reddy', role: 'KIMS', sector: 'medical' },
  { name: 'Dr. Varalakshmi', role: 'KIMS', sector: 'medical' },
  { name: 'Dr. Ajay', role: 'ENT, KIMS', sector: 'medical' },
  { name: 'Dr. Dwarkanath', role: 'ENT specialist', sector: 'medical' },
  { name: 'Dr. Nadeendra Mahindra', role: 'ENT', sector: 'medical' },
  { name: 'Dr. J. Viswanda', role: 'Cardiology', sector: 'medical' },
  { name: 'Dr. Ravinder', role: 'Radiologist', sector: 'medical' },
  { name: 'Dr. Naidumma', role: 'Child specialist', sector: 'medical' },
  { name: 'Dr. Naveen Reddy', role: 'Children specialist', sector: 'medical' },

  { name: 'Justice DSR Varma', role: 'Judiciary', sector: 'judiciary' },
  { name: 'Justice Ramanusam', role: 'Judiciary', sector: 'judiciary' },
  { name: 'Malla Reddy', role: 'MLA', sector: 'judiciary' },

  { name: 'GSL Educational Society', role: 'Education', sector: 'institutions', city: 'Rajahmundry' },
  { name: 'CTRI Guest House', role: 'Guest house', sector: 'institutions', city: 'Rajahmundry' },
  { name: 'Southern Drugs', role: 'Pharmaceuticals', sector: 'institutions', city: 'Rajahmundry' },

  { name: 'Mullapudi Harichandraprasad', role: 'Private residence', sector: 'institutions', city: 'Tanuku' },
  { name: 'Gokaraju Rangaraju', role: 'Private residence', sector: 'institutions' },
  { name: 'TG Venkatesh', role: 'Private residence', sector: 'institutions', city: 'Kurnool' },
];

export type Region = { id: string; label: string; cities: string[] };

/** Where lifts have gone in. The strongest, least sensitive proof we hold. */
export const coverage: Region[] = [
  {
    id: 'telangana',
    label: 'Telangana',
    cities: [
      'Hyderabad',
      'Secunderabad',
      'Rangareddy',
      'Vikarabad',
      'Warangal',
      'Khammam',
      'Nizamabad',
      'Kamareddy',
      'Karimnagar',
      'Nalgonda',
      'Miryalaguda',
      'Mahabubnagar',
      'Bhuvanagiri',
      'Jangaon',
      'Keesaragutta',
      'Raigiri',
    ],
  },
  {
    id: 'andhra',
    label: 'Andhra Pradesh',
    cities: [
      'Visakhapatnam',
      'Vijayawada',
      'Guntur',
      'Kakinada',
      'Rajahmundry',
      'Bhimavaram',
      'Nellore',
      'Ongole',
      'Kurnool',
      'Tanuku',
      'Vinukonda',
    ],
  },
];

export const coverageTotals = {
  cities: coverage.reduce((n, r) => n + r.cities.length, 0),
  regions: coverage.length,
  namedClients: namedClients.length,
};
