import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Px from '../graphics/Px';

/**
 * EventRegistrationModal:
 * Embedded Google Form registration modal with:
 * - Direct iframe embed using ?embedded=true
 * - Retro pixel loading indicator
 * - Keyboard accessibility (Escape key, focus trap)
 * - Background scroll lock with clean unmount restoration
 * - Fallback link to open in new tab
 * - Restores focus to the triggering element upon close
 */
export default function EventRegistrationModal({ event, onClose, triggerRef }) {
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Background scroll lock & Escape listener & Focus Management
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on mount
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Simple focus trap inside modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      // Return focus to triggering button
      triggerRef?.current?.focus();
    };
  }, [onClose, triggerRef]);

  if (!event) return null;

  const rawUrl = event.embedUrl || event.registrationUrl;
  const embedUrl = rawUrl.includes('?') ? `${rawUrl}&embedded=true` : `${rawUrl}?embedded=true`;
  const externalUrl = event.registrationUrl || rawUrl;

  return (
    <div
      className="reg-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        className="win reg-modal-win"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Retro Window Titlebar */}
        <div className="bar reg-modal-bar">
          <i aria-hidden="true" />
          <h2 id="reg-modal-title" className="reg-modal-heading">
            REGISTRATION // {event.title}
          </h2>
          <button
            ref={closeButtonRef}
            className="reg-modal-x"
            onClick={onClose}
            aria-label="Close registration dialog"
          >
            [X]
          </button>
        </div>

        {/* Modal Subheader with Fallback Link */}
        <div className="reg-modal-info">
          <div className="reg-modal-summary">
            <span className="reg-modal-badge">{event.category || 'EVENT'}</span>
            <span className="reg-modal-date">{event.date}</span>
            {event.venue && <span className="reg-modal-venue">@ {event.venue}</span>}
          </div>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reg-fallback-link"
          >
            OPEN FORM IN NEW TAB <Px name="arrow" className="inl ext" />
          </a>
        </div>

        {/* Modal Body with Embedded Google Form */}
        <div className="reg-modal-body">
          {loading && (
            <div className="reg-loader" aria-live="polite">
              <div className="reg-spinner" aria-hidden="true" />
              <p className="reg-loader-text">CONNECTING TO GOOGLE FORMS...</p>
              <p className="reg-loader-hint">
                If the form does not appear,{' '}
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reg-loader-fallback"
                >
                  open directly here
                </a>.
              </p>
            </div>
          )}

          <iframe
            title={`Registration form for ${event.title}`}
            src={embedUrl}
            className={`reg-iframe ${loading ? 'reg-iframe-hidden' : 'reg-iframe-visible'}`}
            onLoad={() => setLoading(false)}
            loading="lazy"
          >
            Loading registration form...
          </iframe>
        </div>

        {/* Modal Footer Controls */}
        <div className="reg-modal-footer">
          <button
            type="button"
            className="btn reg-close-btn"
            onClick={onClose}
          >
            CLOSE WINDOW
          </button>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn go reg-external-btn"
          >
            OPEN IN NEW TAB <Px name="arrow" className="inl" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
