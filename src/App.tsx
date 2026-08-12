import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import ShaftRail from './components/ShaftRail';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';

import { ElevatorConfigProvider } from './hooks/useElevatorConfig';
import { useRouteChrome } from './hooks/useRouteChrome';
import { useScrollRefresh } from './hooks/useScrollAnimation';

import Home from './pages/Home';
import Elevators from './pages/Elevators';
import Solutions from './pages/Solutions';
import Customize from './pages/Customize';
import ProjectsPage from './pages/ProjectsPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Quote from './pages/Quote';
import NotFound from './pages/NotFound';

/**
 * One shell, seven routes. The configuration provider sits above the router
 * outlet, so a lift configured on /customize is still configured when the
 * visitor reaches /contact.
 */
export default function App() {
  useScrollRefresh();
  useRouteChrome();

  return (
    <ElevatorConfigProvider>
      <Navbar />
      <ShaftRail />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/elevators" element={<Elevators />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <StickyCTA />
    </ElevatorConfigProvider>
  );
}
