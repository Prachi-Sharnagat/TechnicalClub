import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Full-size poster viewer lightbox.
 * Accessible modal: Escape key, CLOSE button, or backdrop click closes it.
 * Locks body scroll on open and restores on unmount.
 */
export default function Lightbox({ item, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <motion.div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Poster for ${item.title}`}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="lb-content" onClick={(e) => e.stopPropagation()}>
        <div className="lb-bar">
          <span className="lb-title">// POSTER // {item.title}</span>
          <button
            ref={closeRef}
            type="button"
            className="btn lb-x"
            onClick={onClose}
            aria-label="Close poster viewer"
          >
            CLOSE [ESC]
          </button>
        </div>

        <motion.div
          className="lb-img-container"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="lb-img"
            src={item.poster}
            alt={item.posterAlt || item.alt || `${item.title} full poster`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
