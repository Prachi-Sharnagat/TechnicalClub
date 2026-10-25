import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  EVENT_CATEGORIES,
  EVENTS_DATA,
  getEventsByStatus
} from '../../data/events';
import EventTabs from './EventTabs';
import EventCard from './EventCard';
import EventRegistrationModal from './EventRegistrationModal';
import EventEmptyState from './EventEmptyState';
import Lightbox from './Lightbox';
import SecHead from '../graphics/SecHead';

const STORAGE_KEY = 'tc_events_active_category';
const VALID_CATEGORIES = ['ongoing', 'upcoming', 'past'];

export default function EventsManager() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Session and URL Category Synchronization
  const initialCategory = useMemo(() => {
    // Check URL query param first (?tab= or ?category=)
    const param = searchParams.get('tab') || searchParams.get('category');
    if (param && VALID_CATEGORIES.includes(param)) {
      return param;
    }

    // Check sessionStorage next
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved && VALID_CATEGORIES.includes(saved)) {
        return saved;
      }
    } catch {
      // Storage access blocked/restricted
    }

    // Default to ongoing if it has events, otherwise past
    const hasOngoing = EVENTS_DATA.some((e) => e.displayStatus === 'ongoing');
    return hasOngoing ? 'ongoing' : 'past';
  }, [searchParams]);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [lightboxEvent, setLightboxEvent] = useState(null);
  const triggerRef = useRef(null);

  // Sync category state to sessionStorage & URL searchParams without page reloads
  const handleSelectCategory = (cat) => {
    if (!VALID_CATEGORIES.includes(cat)) return;
    setActiveCategory(cat);

    try {
      sessionStorage.setItem(STORAGE_KEY, cat);
    } catch {
      // storage unavailable
    }

    // Update query param smoothly
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('tab', cat);
    window.history.replaceState(null, '', `${window.location.pathname}?${currentParams.toString()}`);
  };

  // Keep state synced if URL changes externally
  useEffect(() => {
    const urlTab = searchParams.get('tab') || searchParams.get('category');
    if (urlTab && VALID_CATEGORIES.includes(urlTab) && urlTab !== activeCategory) {
      setActiveCategory(urlTab);
    }
  }, [searchParams, activeCategory]);

  // Compute counts for tabs
  const categoryCounts = useMemo(() => {
    return {
      ongoing: EVENTS_DATA.filter((e) => e.displayStatus === 'ongoing').length,
      upcoming: EVENTS_DATA.filter((e) => e.displayStatus === 'upcoming').length,
      past: EVENTS_DATA.filter((e) => e.displayStatus === 'past').length
    };
  }, []);

  // Filter events for the active category
  const filteredEvents = useMemo(() => {
    return getEventsByStatus(activeCategory);
  }, [activeCategory]);

  const handleOpenRegister = (event, ref) => {
    triggerRef.current = ref?.current || null;
    setRegisterEvent(event);
  };

  const handleOpenLightbox = (event) => {
    setLightboxEvent(event);
  };

  const activeCategoryMeta = EVENT_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section className="gsec ev-manager" id="events-hub" aria-label="Events Hub">
      {/* Category Tabs */}
      <SecHead title="EXPLORE CLUB EVENTS" />

      <EventTabs
        activeTab={activeCategory}
        onSelectTab={handleSelectCategory}
        counts={categoryCounts}
      />

      {/* Active Tab Panel */}
      <div
        id={`panel-${activeCategory}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeCategory}`}
        className="ev-tabpanel"
        tabIndex={0}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="ev-panel-content"
          >
            {filteredEvents.length > 0 ? (
              <div className="cards3 ev-cards-grid">
                {filteredEvents.map((evt, idx) => (
                  <EventCard
                    key={evt.id || evt.title}
                    event={evt}
                    index={idx}
                    onOpenRegister={handleOpenRegister}
                    onOpenLightbox={handleOpenLightbox}
                  />
                ))}
              </div>
            ) : (
              <EventEmptyState
                title={
                  activeCategory === 'upcoming'
                    ? 'NEW EVENTS LOADING... STAY TUNED!'
                    : `NO ${activeCategoryMeta?.label || 'EVENTS'} RECORDED`
                }
                message={
                  activeCategory === 'upcoming'
                    ? 'The Technical Club crew is engineering the next set of workshops and contests. Check back soon!'
                    : 'Check our other event categories for past highlights and ongoing registrations.'
                }
                onSwitchCategory={handleSelectCategory}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Embedded Google Form Registration Modal */}
      <AnimatePresence>
        {registerEvent && (
          <EventRegistrationModal
            event={registerEvent}
            onClose={() => setRegisterEvent(null)}
            triggerRef={triggerRef}
          />
        )}
      </AnimatePresence>

      {/* Full Poster Lightbox */}
      <AnimatePresence>
        {lightboxEvent && (
          <Lightbox
            item={lightboxEvent}
            onClose={() => setLightboxEvent(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
