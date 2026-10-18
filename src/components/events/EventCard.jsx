import { useRef } from 'react';
import { motion } from 'framer-motion';
import { sm, tr } from '../../lib/motion';
import Px from '../graphics/Px';
import AppLink from '../AppLink';

/**
 * EventCard:
 * Reusable event card supporting Ongoing, Past, and Upcoming event states.
 * - Preserves complete poster composition with object-fit: contain
 * - Displays pixel badges (LIVE REGISTRATION, COMPLETED, domain tags)
 * - Accessible preview trigger for full-size poster lightbox
 * - Supports embedded Google Form registration modal trigger or internal route
 */
export default function EventCard({
  event,
  index = 0,
  onOpenRegister,
  onOpenLightbox
}) {
  const registerButtonRef = useRef(null);

  const isOngoing = event.displayStatus === 'ongoing';
  const isPast = event.displayStatus === 'past';
  const isUpcoming = event.displayStatus === 'upcoming';
  const hasPoster = Boolean(event.poster);

  const handleRegisterClick = (e) => {
    if (event.registrationType === 'google-form') {
      e.preventDefault();
      onOpenRegister?.(event, registerButtonRef);
    }
  };

  return (
    <motion.article
      className={`br ev-card ${isOngoing ? 'ev-card-ongoing' : ''} ${isPast ? 'ev-card-past' : ''} ${event.featured ? 'ev-card-featured' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={sm(0.5, index * 0.08)}
    >
      {/* Top Header / Badges */}
      <div className="ev-card-header">
        <div className="ev-card-tags">
          {event.category && <span className="tag">{event.category}</span>}
          {event.theme && <span className="tag ev-theme-tag">{event.theme}</span>}
        </div>
        {isOngoing && (
          <span className="ev-badge ev-badge-live">
            <span className="live-dot" aria-hidden="true" />
            {event.badge || 'LIVE REGISTRATION'}
          </span>
        )}
        {isPast && (
          <span className="ev-badge ev-badge-completed">
            {event.badge || 'COMPLETED'}
          </span>
        )}
      </div>

      {/* Poster Media (if present) - with object-fit: contain preserving full composition */}
      {hasPoster && (
        <div className="ev-poster-frame">
          <button
            type="button"
            className="ev-poster-button"
            onClick={() => onOpenLightbox?.(event)}
            aria-label={`View full poster for ${event.title}`}
          >
            <div className="ev-poster-container">
              <img
                src={event.poster}
                alt={event.posterAlt || `${event.title} poster`}
                loading="lazy"
                className="ev-poster-img"
              />
            </div>
            <div className="ev-poster-overlay" aria-hidden="true">
              <span className="ev-poster-zoom-hint">
                <Px name="image" className="inl" /> VIEW POSTER
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Non-poster event icon */}
      {!hasPoster && event.icon && (
        <div className="ev-icon-wrapper">
          <div className="svc-ic">
            <Px name={event.icon} />
          </div>
        </div>
      )}

      {/* Card Content Body */}
      <div className="ev-card-body">
        {event.organizer && (
          <div className="ev-card-organizer">// {event.organizer}</div>
        )}

        <h3 className="ev-card-title">{event.title}</h3>

        {event.tagline && (
          <p className="ev-card-tagline">“{event.tagline}”</p>
        )}

        {event.description && (
          <p className="ev-card-desc">{event.description}</p>
        )}

        {/* Structured Metadata (Date, Time, Venue) */}
        <div className="ev-meta-box">
          {event.date && (
            <div className="ev-meta-row">
              <span className="ev-meta-key">DATE:</span>
              <span className="ev-meta-val">{event.date}</span>
            </div>
          )}
          {event.time && (
            <div className="ev-meta-row">
              <span className="ev-meta-key">TIME:</span>
              <span className="ev-meta-val">{event.time}</span>
            </div>
          )}
          {event.venue && (
            <div className="ev-meta-row">
              <span className="ev-meta-key">VENUE:</span>
              <span className="ev-meta-val">{event.venue}</span>
            </div>
          )}
          {(() => {
            const uniqueFacts = (event.facts || []).filter((fact) => {
              const lower = fact.toLowerCase();
              if (/^(organizer|date|time|venue)\s*:/i.test(fact)) return false;
              if (event.date && lower.includes(event.date.toLowerCase())) return false;
              if (event.venue && lower.includes(event.venue.toLowerCase())) return false;
              if (event.organizer && lower.includes(event.organizer.toLowerCase())) return false;
              return true;
            });
            if (uniqueFacts.length === 0) return null;
            return (
              <ul className="ev-facts-list">
                {uniqueFacts.map((fact, idx) => (
                  <li key={idx} className="ev-fact-item">{fact}</li>
                ))}
              </ul>
            );
          })()}
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="ev-card-footer">
        {isOngoing && event.registrationOpen && (
          <motion.button
            ref={registerButtonRef}
            type="button"
            className="btn go ev-action-btn"
            onClick={handleRegisterClick}
            whileHover={{ y: -3, transition: tr(0.2) }}
          >
            REGISTER NOW <Px name="arrow" className="inl" />
          </motion.button>
        )}

        {isUpcoming && event.registrationOpen && event.registrationUrl && (
          <AppLink
            className="btn go ev-action-btn"
            href={event.registrationUrl}
          >
            REGISTER <Px name="arrow" className="inl" />
          </AppLink>
        )}

        {isPast && (
          <div className="ev-past-stamp-box">
            <span className="ev-past-stamp">EVENT CONCLUDED</span>
            {hasPoster && (
              <button
                type="button"
                className="btn ev-view-poster-btn"
                onClick={() => onOpenLightbox?.(event)}
              >
                VIEW POSTER
              </button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
