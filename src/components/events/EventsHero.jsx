import { motion } from 'framer-motion';
import { sm, tr } from '../../lib/motion';
import { HERO } from '../../data/events';
import CalendarArt from './CalendarArt';

export default function EventsHero({ onSelectCategory }) {
  const handleCategoryClick = (catId, e) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('tab', catId);
      window.history.replaceState(null, '', `${window.location.pathname}?${currentParams.toString()}`);
      window.dispatchEvent(new Event('popstate'));
    }
    const hub = document.getElementById('events-hub');
    if (hub) {
      hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="ghero" aria-label="Events Introduction">
      <motion.div className="g-text" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={sm(0.7)}>
        <div className="g-label">{HERO.label}</div>
        <h1>{HERO.title}<span className="cur" /></h1>
        <p>{HERO.intro}</p>
      </motion.div>
      <motion.div className="g-art" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={sm(0.9, 0.2)}>
        <CalendarArt />
      </motion.div>
      <motion.div className="g-btns" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={sm(0.7, 0.4)}>
        <motion.a
          className="btn go"
          href="#events-hub"
          onClick={(e) => handleCategoryClick('ongoing', e)}
          whileHover={{ y: -4, transition: tr(0.2) }}
        >
          ONGOING EVENTS
        </motion.a>
        <motion.a
          className="btn"
          href="#events-hub"
          onClick={(e) => handleCategoryClick('upcoming', e)}
          whileHover={{ y: -4, transition: tr(0.2) }}
        >
          UPCOMING EVENTS
        </motion.a>
        <motion.a
          className="btn"
          href="#events-hub"
          onClick={(e) => handleCategoryClick('past', e)}
          whileHover={{ y: -4, transition: tr(0.2) }}
        >
          PAST EVENTS
        </motion.a>
      </motion.div>
    </section>
  );
}
