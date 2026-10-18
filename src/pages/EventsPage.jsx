import { NAV, REGISTER_URL } from '../data/events';
import GNav from '../components/graphics/GNav';
import JoinCta from '../components/graphics/JoinCta';
import Footer from '../components/Footer';
import EventsHero from '../components/events/EventsHero';
import EventsManager from '../components/events/EventsManager';

export default function EventsPage() {
  return (
    <>
      <GNav links={NAV} />
      <div className="wrap">
        <EventsHero />
        <EventsManager />
        <JoinCta label="REGISTER NOW" kicker="// DON'T MISS THE NEXT ONE" href={REGISTER_URL} />
      </div>
      <Footer text="Technical Club. Events." />
    </>
  );
}
