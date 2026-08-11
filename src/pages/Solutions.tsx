import PageHeader from '../components/ui/PageHeader';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import CtaBand from '../components/CtaBand';

export default function Solutions() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title={'Everything between\nthe drawing and the ride'}
        lead="Structure design, fabrication, installation and commissioning are handled by one team — plus solar water heating for the same home."
        facts={[
          { label: 'Design', value: 'Shaft layout coordinated with your architect' },
          { label: 'Build', value: 'Fabrication and on-site erection' },
          { label: 'Handover', value: 'Testing, commissioning and guidance' },
        ]}
      />
      <Services />
      <HowItWorks />
      <CtaBand
        eyebrow="Start with an assessment"
        title="Book the site visit first."
        lead="The visit tells us what the building can take. Everything after it — design, fabrication, installation — follows from what we measure."
      />
    </>
  );
}
