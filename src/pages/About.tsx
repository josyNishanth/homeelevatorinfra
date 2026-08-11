import PageHeader from '../components/ui/PageHeader';
import WhyChooseUs from '../components/WhyChooseUs';
import TrustStrip from '../components/TrustStrip';
import FAQ from '../components/FAQ';
import CtaBand from '../components/CtaBand';

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={'Built around the home,\nnot the machine.'}
        lead="We design the structure, fabricate it, install it and commission it. One team holds the whole job, so accountability never moves between suppliers."
        facts={[
          { label: 'Scope', value: 'Design through commissioning, in-house' },
          { label: 'Focus', value: 'Residential — villas, duplexes, homes' },
          { label: 'Also', value: 'Solar water heating systems' },
        ]}
      />
      <WhyChooseUs />
      <TrustStrip />
      <FAQ />
      <CtaBand />
    </>
  );
}
