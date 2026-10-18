import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS_DATA, GOOGLE_FORM_URL } from '../data/events';
import { CLUB_CONTACT } from '../data/contact';
import EventRegistrationModal from '../components/events/EventRegistrationModal';
import SecHead from '../components/graphics/SecHead';
import Px from '../components/graphics/Px';
import CollaborationForm from '../components/contact/CollaborationForm';
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
                  {featuredEvent.organizer && (
                    <span className="reg-organizer-pill">
                      // {featuredEvent.organizer}
                    </span>
                  )}
                </div>

                <h1 className="reg-event-title">{featuredEvent.title}</h1>
                <p className="reg-tagline">{featuredEvent.tagline}</p>
                <p className="reg-description">{featuredEvent.description}</p>

                {/* Structured Event Details: Date, Time, Venue */}
                <div className="reg-meta-list">
                  <div className="reg-meta-item">
                    <span className="reg-meta-label">DATE:</span>
                    <span className="reg-meta-val">{featuredEvent.date}</span>
                  </div>

                  <div className="reg-meta-item">
                    <span className="reg-meta-label">TIME:</span>
                    <span className="reg-meta-val">{featuredEvent.time}</span>
                  </div>

                  <div className="reg-meta-item reg-meta-venue">
                    <span className="reg-meta-label">VENUE:</span>
                    <span className="reg-meta-val">{featuredEvent.venue}</span>
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
        </>
      )}

      {/* Visually Distinct Contact Us Section */}
      <motion.section
        className="reg-contact-section"
        aria-labelledby="reg-contact-title"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="reg-contact-head">
          <SecHead title="CONTACT US" />
          <p className="reg-contact-intro">
            {CLUB_CONTACT.invitation}
          </p>
        </div>

        <div className="reg-contact-grid">
          {/* Email Card */}
          <div className="reg-contact-card">
            <div className="reg-contact-card-top">
              <span className="reg-contact-tag">// OFFICIAL INBOX</span>
              <span className="reg-contact-badge email">DIRECT EMAIL</span>
            </div>
            <div className="reg-contact-icon-row">
              <span className="reg-contact-symbol email-symbol" aria-hidden="true">
                <svg
                  className="reg-contact-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <div className="reg-contact-heading-wrap">
                <h3 className="reg-contact-card-title">EMAIL US</h3>
                <span className="reg-contact-card-subtitle">Questions and project enquiries</span>
              </div>
            </div>
            <p className="reg-contact-card-desc">
              Reach out for technical questions, project collaborations, workshops, or club activities.
            </p>
            <div className="reg-contact-meta">
              <span className="reg-contact-label">EMAIL:</span>
              <a
                href={`mailto:${CLUB_CONTACT.email}`}
                className="reg-contact-value reg-contact-link"
                title={`Send email to ${CLUB_CONTACT.email}`}
              >
                {CLUB_CONTACT.email}
              </a>
            </div>
            <a
              href={`mailto:${CLUB_CONTACT.email}`}
              className="btn go reg-contact-btn"
              aria-label={`Send email to ${CLUB_CONTACT.email}`}
            >
              <span>SEND EMAIL</span>
              <Px name="arrow" className="inl" />
            </a>
          </div>

          {/* Instagram Card */}
          <div className="reg-contact-card instagram-accent">
            <div className="reg-contact-card-top">
              <span className="reg-contact-tag">// SOCIAL FEED</span>
              <span className="reg-contact-badge instagram">INSTAGRAM</span>
            </div>
            <div className="reg-contact-icon-row">
              <span className="reg-contact-symbol instagram-symbol" aria-hidden="true">
                <svg
                  className="reg-contact-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </span>
              <div className="reg-contact-heading-wrap">
                <h3 className="reg-contact-card-title">INSTAGRAM</h3>
                <span className="reg-contact-card-subtitle">Events and club updates</span>
              </div>
            </div>
            <p className="reg-contact-card-desc">
              Follow for live event footage, Robo Drive build clips, hackathon alerts, and club updates.
            </p>
            <div className="reg-contact-meta">
              <span className="reg-contact-label">HANDLE:</span>
              <a
                href={CLUB_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="reg-contact-value reg-contact-link"
                title="Open Technical Club RBU official Instagram in a new tab"
              >
                {CLUB_CONTACT.instagram}
              </a>
            </div>
            <a
              href={CLUB_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn reg-contact-btn reg-contact-btn-social"
              aria-label="Open Technical Club RBU official Instagram in a new tab"
            >
              <span>OPEN INSTAGRAM</span>
              <Px name="arrow" className="inl ext" />
            </a>
          </div>

          {/* Campus Location Card */}
          <div className="reg-contact-card location-accent">
            <div className="reg-contact-card-top">
              <span className="reg-contact-tag">// CLUB BASE</span>
              <span className="reg-contact-badge location">CAMPUS</span>
            </div>
            <div className="reg-contact-icon-row">
              <span className="reg-contact-symbol location-symbol" aria-hidden="true">
                <svg
                  className="reg-contact-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div className="reg-contact-heading-wrap">
                <h3 className="reg-contact-card-title">CAMPUS ARENA</h3>
                <span className="reg-contact-card-subtitle">In-person workshop hub</span>
              </div>
            </div>
            <p className="reg-contact-card-desc">
              Connect with club members on-ground during active build nights and robotics sessions.
            </p>
            <div className="reg-contact-meta">
              <span className="reg-contact-label">LOCATION:</span>
              <span className="reg-contact-value">
                {CLUB_CONTACT.location}
              </span>
            </div>
            <div className="reg-contact-footer-note">
              <span>// VISITING HOURS: 10:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>

        {/* Project & Collaboration Enquiry Form */}
        <CollaborationForm />
      </motion.section>

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
