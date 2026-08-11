import PageHeader from '../components/ui/PageHeader';
import Clients from '../components/Clients';
import Projects from '../components/Projects';
import ArchitectureShowcase from '../components/ArchitectureShowcase';
import CtaBand from '../components/CtaBand';
import { coverageTotals } from '../data/clients';

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title={'Installed, occupied,\nstill working.'}
        lead="Lifts photographed where they stand — entrance halls, stair voids, dining rooms, balconies and showrooms. Every one went into a building that was already finished."
        facts={[
          { label: 'Coverage', value: `${coverageTotals.cities}+ cities across Telangana and Andhra Pradesh` },
          { label: 'Settings', value: 'Villas, duplexes, interiors and retail' },
          { label: 'Retrofit', value: 'Most went into completed homes' },
        ]}
      />
      <Clients />
      <Projects />
      <ArchitectureShowcase />
      <CtaBand
        eyebrow="Your home next"
        title="See what this looks like in your house."
        lead="Send a photo of the space you have in mind along with the number of floors, and we will tell you which system fits it."
      />
    </>
  );
}
