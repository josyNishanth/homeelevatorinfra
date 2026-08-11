import PageHeader from '../components/ui/PageHeader';
import ElevatorConfigurator from '../components/elevator/ElevatorConfigurator';
import Pricing from '../components/Pricing';
import CtaBand from '../components/CtaBand';

export default function Customize() {
  return (
    <>
      <PageHeader
        eyebrow="Customize"
        title={'Build it before\nyou buy it.'}
        lead="Pick the system, the height, the exterior finish, the cabin interior and the lighting. Your combination follows you to the quote form."
        facts={[
          { label: 'Finishes', value: 'Standard, textured and metallic' },
          { label: 'Interiors', value: 'Marble, wood and granite' },
          { label: 'Lighting', value: 'Warm, neutral and premium' },
        ]}
      />
      <ElevatorConfigurator />
      <Pricing />
      <CtaBand
        eyebrow="Send your build"
        title="Get this exact configuration priced."
        lead="The quote form arrives pre-filled with the system, height and finishes you selected. Add your city and we will do the rest."
      />
    </>
  );
}
