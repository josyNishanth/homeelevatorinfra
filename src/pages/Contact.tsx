import PageHeader from '../components/ui/PageHeader';
import CtaBand from '../components/CtaBand';
import FAQ from '../components/FAQ';
import { brand } from '../data/content';

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={"Let's find the right lift\nfor your home."}
        lead="Call us, write to us, or send your configuration and we will come back with a written quotation and the next available slot for a site visit."
        facts={[
          { label: 'Phone', value: brand.phones.map((p) => p.display).join('  ·  ') },
          { label: 'Email', value: brand.email },
          { label: 'Area served', value: brand.serviceArea },
        ]}
      />
      <FAQ />
      <CtaBand
        eyebrow="Quotation"
        title="Send us your configuration."
        lead="The quote form takes a minute: floors, lift type and where it should sit. We reply with a written quotation."
      />
    </>
  );
}
