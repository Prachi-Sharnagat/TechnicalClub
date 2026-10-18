import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS_DATA, GOOGLE_FORM_URL } from '../data/events';
import EventRegistrationModal from '../components/events/EventRegistrationModal';
import SecHead from '../components/graphics/SecHead';
import Px from '../components/graphics/Px';
import SigninPage from './SigninPage';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [modalEvent, setModalEvent] = useState(null);
  const [internalEvent, setInternalEvent] = useState(null);
  const triggerRef = useRef(null);

  // Filter events strictly open for registration (excluding past/closed events)
  const openEvents = EVENTS_DATA.filter(
    (e) => e.displayStatus !== 'past' && e.registrationOpen === true
  );

  // Primary active event is Robo Drive if open, or the first open event
  const featuredEvent = openEvents.find((e) => e.featured || e.displayStatus === 'ongoing') || openEvents[0];
  const otherOpenEvents = openEvents.filter((e) => e.id !== featuredEvent?.id);

  // Handle URL query parameter, e.g. /register?event=ROBO%20DRIVE
  useEffect(() => {
    const requestedParam = searchParams.get('event');
    if (!requestedParam) return;

    const matched = openEvents.find(
      (e) =>
        e.title.toLowerCase() === requestedParam.toLowerCase() ||
        e.slug.toLowerCase() === requestedParam.toLowerCase()
    );

    if (matched) {
      if (matched.registrationType === 'google-form') {
        setModalEvent(matched);
      } else {
        setInternalEvent(matched);
      }
    }
  }, [searchParams]);

  const handleRegisterClick = (event, e) => {
    triggerRef.current = e?.currentTarget;
    if (event.registrationType === 'google-form') {
      setModalEvent(event);
    } else {
      setInternalEvent(event);
    }
  };

  return (
    <div className="reg-page-container wrap" role="main">
      {/* Page Header */}
      <div className="reg-header-block">
        <SecHead title="EVENT REGISTRATION" />
        <p className="reg-subtitle">
          Official registration gateway for Technical Club RBU competitions, workshops, and build sessions.
        </p>
      </div>

      {/* Case 1: No events currently open */}
      {openEvents.length === 0 ? (
        <div className="win reg-empty-win" role="status" aria-live="polite">
          <div className="bar">
            <i aria-hidden="true" />
            <span>PORTAL NOTICE // STATUS IDLE</span>
          </div>
          <div style={{ padding: '32px 20px' }}>
            <div className="reg-empty-icon" aria-hidden="true">
              <Px name="chip" />
            </div>
            <h2 className="reg-empty-title">REGISTRATIONS CURRENTLY PAUSED</h2>
            <p className="reg-empty-msg">
              No events are currently open for registration. Check back soon!
            </p>
            <div className="reg-empty-actions">
              <Link to="/events" className="btn go">
                EXPLORE ALL EVENTS
              </Link>
              <Link to="/" className="btn">
                RETURN HOME
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Case 2: Featured Current Live Event (Robo Drive) */}
          {featuredEvent && (
            <motion.section
              className="reg-featured-card"
              aria-label={`Featured Registration: ${featuredEvent.title}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Event Poster */}
              <div className="reg-poster-box">
                {featuredEvent.poster ? (
                  <img
                    src={featuredEvent.poster}
                    alt={featuredEvent.posterAlt || `${featuredEvent.title} Official Poster`}
                    className="reg-poster-img"
                  />
                ) : (
                  <div className="reg-poster-img" style={{ display: 'grid', placeItems: 'center', background: 'var(--panel)' }}>
                    <Px name="bot" />
                  </div>
                )}
                <span className="reg-poster-badge">
                  {featuredEvent.badge || 'LIVE REGISTRATION'}
                </span>
              </div>

              {/* Event Details */}
              <div className="reg-details-box">
                <div className="reg-badge-row">
                  <span className="reg-status-pill open">
                    🟢 REGISTRATION OPEN
                  </span>
                  <span className="reg-category-pill">
                    {featuredEvent.category || 'FEATURED EVENT'}
                  </span>
                </div>

                <h1 className="reg-event-title">{featuredEvent.title}</h1>
                <p className="reg-tagline">{featuredEvent.tagline}</p>
                <p className="reg-description">{featuredEvent.description}</p>

                {/* Metadata List */}
                <div className="reg-meta-list">
                  <div className="reg-meta-item">
                    <span className="reg-meta-label">// DATE & TIME</span>
                    <span className="reg-meta-val">
                      {featuredEvent.date} • {featuredEvent.time}
                    </span>
                  </div>

                  <div className="reg-meta-item">
                    <span className="reg-meta-label">// VENUE</span>
                    <span className="reg-meta-val">{featuredEvent.venue}</span>
                  </div>

                  <div className="reg-meta-item">
                    <span className="reg-meta-label">// ORGANIZER</span>
                    <span className="reg-meta-val">{featuredEvent.organizer}</span>
                  </div>

                  <div className="reg-meta-item">
                    <span className="reg-meta-label">// STATUS</span>
                    <span className="reg-meta-val" style={{ color: '#00ffcc' }}>
                      ACCEPTING ENTRIES
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="reg-actions-row">
                  <button
                    type="button"
                    className="btn go reg-btn-main"
                    onClick={(e) => handleRegisterClick(featuredEvent, e)}
                    aria-haspopup="dialog"
                  >
                    <span>REGISTER NOW [⚡]</span>
                    <Px name="arrow" className="inl" />
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* Case 3: Additional Open Workshops or Hackathons */}
          {otherOpenEvents.length > 0 && (
            <section className="reg-more-section" aria-label="Additional open registrations">
              <SecHead title="MORE OPEN REGISTRATIONS" />
              <p className="sec-intro" style={{ marginTop: '-8px', marginBottom: '24px' }}>
                Explore hands-on technical workshops and upcoming prototyping challenges.
              </p>

              <div className="reg-grid">
                {otherOpenEvents.map((evt) => (
                  <article key={evt.id} className="reg-card">
                    <div className="reg-card-top">
                      <span className="reg-status-pill open">OPEN</span>
                      <span className="reg-category-pill">{evt.category || 'WORKSHOP'}</span>
                    </div>

                    <h2 className="reg-card-title">{evt.title}</h2>
                    <p className="reg-card-tagline">{evt.tagline}</p>
                    <p className="reg-card-desc">{evt.description || evt.text}</p>

                    <div className="reg-card-meta">
                      <div><strong>DATE:</strong> {evt.date}</div>
                      <div><strong>TIME:</strong> {evt.time}</div>
                      <div><strong>VENUE:</strong> {evt.venue}</div>
                    </div>

                    <button
                      type="button"
                      className="btn go reg-card-btn"
                      onClick={(e) => handleRegisterClick(evt, e)}
                    >
                      REGISTER FOR {evt.title.toUpperCase()}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Embedded Google Form Modal */}
      <AnimatePresence>
        {modalEvent && (
          <EventRegistrationModal
            event={modalEvent}
            onClose={() => setModalEvent(null)}
            triggerRef={triggerRef}
          />
        )}
      </AnimatePresence>

      {/* Internal Registration Dialog */}
      <AnimatePresence>
        {internalEvent && (
          <div
            className="reg-internal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="internal-reg-title"
            onClick={() => setInternalEvent(null)}
          >
            <div
              className="win reg-internal-win"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="reg-internal-bar">
                <i aria-hidden="true" />
                <span id="internal-reg-title">REGISTER // {internalEvent.title}</span>
                <button
                  type="button"
                  className="reg-internal-close"
                  onClick={() => setInternalEvent(null)}
                  aria-label="Close dialog"
                >
                  [X]
                </button>
              </div>
              <div style={{ padding: '16px' }}>
                <SigninPage preselectedEvent={internalEvent.title} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
