import PageHeader from '../components/ui/PageHeader';
import QuoteForm from '../components/QuoteForm';
import FAQ from '../components/FAQ';
import { brand } from '../data/content';

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={"Let's find the right lift\nfor your home."}
        lead="Send your configuration and we will come back with a written quotation and the next available slot for a site visit."
        facts={[
          { label: 'Phone', value: brand.phones.map((p) => p.display).join('  ·  ') },
          { label: 'Email', value: brand.email },
          { label: 'Area served', value: brand.serviceArea },
        ]}
      />
      <QuoteForm />
      <FAQ />
    </>
  );
}
