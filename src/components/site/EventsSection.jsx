import { REGISTER_URL } from '../../data/events';
import EventsHero from '../events/EventsHero';
import EventsManager from '../events/EventsManager';
import JoinCta from '../graphics/JoinCta';

export default function EventsSection() {
  return (
    <div className="wrap">
      <EventsHero />
      <EventsManager />
      <JoinCta label="REGISTER NOW" kicker="// DON'T MISS THE NEXT ONE" href={REGISTER_URL} />
    </div>
  );
}
