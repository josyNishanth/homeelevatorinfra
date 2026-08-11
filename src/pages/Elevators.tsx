import PageHeader from '../components/ui/PageHeader';
import ElevatorTypes from '../components/ElevatorTypes';
import BeforeAfter from '../components/BeforeAfter';
import CtaBand from '../components/CtaBand';

export default function Elevators() {
  return (
    <>
      <PageHeader
        eyebrow="Elevators"
        title={'Three systems.\nOne right answer.'}
        lead="Vacuum, hydraulic and cylindrical lifts, with the capacity, power and site requirements for each — so you can rule out what will not fit before anyone visits."
        facts={[
          { label: 'Stops', value: 'Up to four, G+1 through G+3' },
          { label: 'Civil work', value: 'From no pit and no machine room' },
          { label: 'Supply', value: 'Single-phase options available' },
        ]}
      />
      <ElevatorTypes />
      <BeforeAfter />
      <CtaBand
        eyebrow="Not sure which"
        title="We will tell you which one fits."
        lead="Send the number of floors and where you want the lift to sit. If a system will not work in your space, we say so before quoting."
      />
    </>
  );
}
