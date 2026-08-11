import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import ProductShowcase from '../components/ProductShowcase';
import Pricing from '../components/Pricing';
import ArchitectureShowcase from '../components/ArchitectureShowcase';
import Testimonials from '../components/Testimonials';
import CtaBand from '../components/CtaBand';

/**
 * Discover → compare → see price → aspire → act. Detail lives on the
 * dedicated routes; home is the overview that sends people to them.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductShowcase />
      <Pricing />
      <ArchitectureShowcase />
      <Testimonials />
      <CtaBand />
    </>
  );
}
