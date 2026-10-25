import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS_DATA, OFFICIAL_REGISTRATION_FORM_URL, GOOGLE_FORM_URL } from '../data/events';
import { CLUB_CONTACT } from '../data/contact';
import { RECRUITMENT_TASKS, MASTER_AUDITION_PDF, MASTER_AUDITION_FILENAME } from '../data/recruitmentTasks';
import EventRegistrationModal from '../components/events/EventRegistrationModal';
import SecHead from '../components/graphics/SecHead';
import Px from '../components/graphics/Px';
import CollaborationForm from '../components/contact/CollaborationForm';
import SigninPage from './SigninPage';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [modalEvent, setModalEvent] = useState(null);
  const [internalEvent, setInternalEvent] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(() => searchParams.get('domain') || null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const d = searchParams.get('domain');
    if (d) setSelectedDomain(d);
  }, [searchParams]);

  const activeTask = RECRUITMENT_TASKS.find(
    (t) =>
      t.slug.toLowerCase() === (selectedDomain || '').toLowerCase() ||
      t.id.toLowerCase() === (selectedDomain || '').toLowerCase()
  );

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

      {/* Clean Official Google Form Event-Registration Card */}
      <motion.section
        className="reg-featured-card reg-official-card"
        aria-label="Official Technical Club RBU Event Registration"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Retro Pixel Art Box */}
        <div className="reg-poster-box reg-official-poster-box">
          <div className="reg-official-art">
            <div className="reg-official-glow" aria-hidden="true" />
            <img
              src="/technical-club-logo.png"
              alt="Technical Club RBU Official Logo"
              className="reg-official-logo"
              width="140"
              height="140"
              loading="lazy"
            />
            <div className="reg-official-badge-pixel">
              <Px name="chip" className="inl" />
              <span>OFFICIAL FORM</span>
            </div>
          </div>
          <span className="reg-poster-badge">GOOGLE FORM</span>
        </div>

        {/* Card Details */}
        <div className="reg-details-box">
          <div className="reg-badge-row">
            <span className="reg-status-pill open">
              🟢 REGISTRATION OPEN
            </span>
            <span className="reg-category-pill reg-google-form-pill">
              OFFICIAL GOOGLE FORM
            </span>
            <span className="reg-organizer-pill">
              // Technical Club RBU
            </span>
          </div>

          <h1 className="reg-event-title">EVENT REGISTRATION</h1>
          <p className="reg-tagline">Technical Club RBU Official Portal</p>
          <p className="reg-description">
            Register for Technical Club RBU events using our official registration form.
          </p>

          {/* Structured Details Strip */}
          <div className="reg-meta-list reg-official-meta-list">
            <div className="reg-meta-item">
              <span className="reg-meta-label">PORTAL:</span>
              <span className="reg-meta-val">Google Forms</span>
            </div>

            <div className="reg-meta-item">
              <span className="reg-meta-label">STATUS:</span>
              <span className="reg-meta-val">Accepting Entries</span>
            </div>

            <div className="reg-meta-item">
              <span className="reg-meta-label">ACCESS:</span>
              <span className="reg-meta-val">Instant Confirmation</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="reg-actions-row">
            <a
              href={OFFICIAL_REGISTRATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn go reg-btn-main reg-btn-official"
              aria-label="Register now for Technical Club RBU events via official Google Form (opens in a new tab)"
            >
              <span>REGISTER NOW →</span>
            </a>
            <a
              href={activeTask ? activeTask.pdfUrl : (MASTER_AUDITION_PDF || '#domain-tasks')}
              target={activeTask || MASTER_AUDITION_PDF ? '_blank' : undefined}
              rel={activeTask || MASTER_AUDITION_PDF ? 'noopener noreferrer' : undefined}
              className="btn reg-btn-main reg-btn-task-hero"
              aria-label={
                activeTask
                  ? `View ${activeTask.name} task PDF (opens in a new tab)`
                  : 'View Technical Club audition task PDF (opens in a new tab)'
              }
            >
              <span>VIEW TASK PDF ↗</span>
            </a>
            {activeTask && (
              <div className="reg-selected-domain-pill">
                <span>TASK: {activeTask.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDomain(null)}
                  className="reg-clear-domain-btn"
                  title="Clear domain selection"
                  aria-label="Clear domain selection"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* DOMAIN-WISE RECRUITMENT TASKS SECTION */}
      <motion.section
        id="domain-tasks"
        className="reg-tasks-section"
        aria-labelledby="reg-tasks-heading"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="reg-header-block">
          <SecHead title="DOMAIN-WISE RECRUITMENT TASKS" />
          <p className="reg-subtitle">
            Choose your domain, open the task PDF, and follow the instructions before applying.
          </p>
        </div>

        {/* Master Audition Booklet Bar */}
        <div className="reg-tasks-master-bar">
          <span className="reg-master-label">// ALL-IN-ONE AUDITION BOOKLET:</span>
          <a
            href={MASTER_AUDITION_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="reg-master-link"
            aria-label="View complete Technical Club audition tasks PDF for all domains"
          >
            <span>{MASTER_AUDITION_FILENAME} (All Domains) ↗</span>
          </a>
        </div>

        <div className="reg-tasks-grid">
          {RECRUITMENT_TASKS.map((task, idx) => {
            const isSelected =
              selectedDomain &&
              (selectedDomain.toLowerCase() === task.slug.toLowerCase() ||
                selectedDomain.toLowerCase() === task.id.toLowerCase());
            return (
              <motion.div
                key={task.slug}
                className={`br reg-task-card${isSelected ? ' selected' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="reg-task-top">
                  <div className="svc-ic">
                    <Px name={task.icon} />
                  </div>
                  <span className="reg-task-num">// DOMAIN 0{idx + 1}</span>
                </div>

                <h3 className="reg-task-title">{task.name}</h3>
                <p className="reg-task-desc">{task.description}</p>

                {task.pdfUrl ? (
                  <a
                    href={task.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn go reg-task-btn"
                    onClick={() => setSelectedDomain(task.slug)}
                    aria-label={`View task PDF for ${task.name} (opens in a new tab)`}
                  >
                    <span>VIEW TASK PDF →</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="btn reg-task-btn reg-task-btn-disabled"
                    aria-disabled="true"
                  >
                    <span>TASK PDF COMING SOON</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.section>

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
        </div>

        <div className="reg-contact-grid">
          {/* Email Option */}
          <div className="reg-contact-card">
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
                <h3 className="reg-contact-card-title">EMAIL</h3>
                <a
                  href={`mailto:${CLUB_CONTACT.email}`}
                  className="reg-contact-value reg-contact-link"
                  title={`Send email to ${CLUB_CONTACT.email}`}
                >
                  {CLUB_CONTACT.email}
                </a>
              </div>
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

          {/* Instagram Option */}
          <div className="reg-contact-card instagram-accent">
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
        </div>

        {/* Project & Collaboration Enquiry Form */}
        <CollaborationForm />

        {/* Official Club Logo */}
        <div className="reg-contact-brand-logo">
          <img
            src="/technical-club-logo.png"
            alt="Technical Club RBU Official Logo"
            className="reg-club-logo-img"
            width="140"
            height="140"
            loading="lazy"
          />
        </div>
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
