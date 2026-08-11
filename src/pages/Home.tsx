import { ElevatorConfigProvider } from '../hooks/useElevatorConfig';
import { useScrollRefresh } from '../hooks/useScrollAnimation';

import Navbar from '../components/Navbar';
import ShaftRail from '../components/ShaftRail';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import ElevatorTypes from '../components/ElevatorTypes';
import ProductShowcase from '../components/ProductShowcase';
import Pricing from '../components/Pricing';
import ElevatorConfigurator from '../components/elevator/ElevatorConfigurator';
import HowItWorks from '../components/HowItWorks';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import ArchitectureShowcase from '../components/ArchitectureShowcase';
import BeforeAfter from '../components/BeforeAfter';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import QuoteForm from '../components/QuoteForm';
import StickyCTA from '../components/StickyCTA';
import Footer from '../components/Footer';

/**
 * Section order follows the journey the brief asks for:
 * discover → explore → compare → customise → see price → request quote.
 */
export default function Home() {
  useScrollRefresh();

  return (
    <ElevatorConfigProvider>
      <Navbar />
      <ShaftRail />

      <main>
        <Hero />
        <TrustStrip />
        <ElevatorTypes />
        <ProductShowcase />
        <Pricing />
        <ElevatorConfigurator />
        <HowItWorks />
        <Services />
        <WhyChooseUs />
        <ArchitectureShowcase />
        <BeforeAfter />
        <Projects />
        <Testimonials />
        <FAQ />
        <QuoteForm />
      </main>

      <Footer />
      <StickyCTA />
    </ElevatorConfigProvider>
  );
}
